require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ 
    dest: 'uploads/',
    limits: {
        fieldSize: 10 * 1024 * 1024,
    }
});
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://web-whispers-26c6dd91cb2b.herokuapp.com/'],
    credentials: true, // Enable credentials (cookies, authorization headers)
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userData = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = await User.findOne({ username });
        if (!userData) {
            return res.status(400).json('Invalid username or password');
        }

        const passwordCheck = bcrypt.compareSync(password, userData.password);

        if (passwordCheck) {
            const token = jwt.sign({ username, id: userData._id }, secret);
            res.cookie('token', token, { httpOnly: true }).json({
                id: userData._id,
                username,
            });
        } else {
            res.status(400).json('Invalid username or password');
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json('Internal server error');
    }
});

app.get('/profile', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
    
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        res.json(decoded);
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json('OK');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);

        const { token } = req.cookies;
        jwt.verify(token, secret, async (err, info) => {
            if (err) throw err;

            const { title, highlight, content } = req.body;
            const postData = await Post.create({
                title,
                highlight,
                content,
                backdrop: newPath,
                author: info.id,
            });

            res.json(postData);
        });
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json('Internal server error');
    }
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        let newPath = null;

        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = `${path}.${ext}`;
            fs.renameSync(path, newPath);
        }

        const { token } = req.cookies;
        jwt.verify(token, secret, async (err, info) => {
            if (err) throw err;

            const { id, title, highlight, content } = req.body;
            const postData = await Post.findById(id);

            if (!postData) {
                return res.status(404).json('Post not found');
            }

            if (postData.author.toString() !== info.id) {
                return res.status(403).json('You do not have the permission to edit this post.');
            }

            postData.title = title;
            postData.highlight = highlight;
            postData.content = content;
            if (newPath) {
                postData.backdrop = newPath;
            }

            await postData.save();

            res.json(postData);
        });
    } catch (error) {
        console.error('Post update error:', error);
        res.status(500).json('Internal server error');
    }
});

app.delete('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);

        const postData = await Post.findById(id);

        if (!postData) {
            return res.status(404).json('Post not found');
        }

        if (postData.author.toString() !== decoded.id) {
            return res.status(403).json('You do not have the permission to delete this post.');
        }

        await Post.findByIdAndDelete(id);

        if (postData.backdrop) {
            fs.unlinkSync(postData.backdrop);
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Post deletion error:', error);
        res.status(500).json('Internal server error');
    }
});

app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json('Internal server error');
    }
});

app.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postData = await Post.findById(id).populate('author', ['username']);

        if (!postData) {
            return res.status(404).json('Post not found');
        }

        res.json(postData);
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json('Internal server error');
    }
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/', (req, res) => {
    console.log('Serving React app for root route /');
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'), err => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send(err);
      }
    });
  });

// Catch-all route to serve the React frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
