require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer'); // For handling file uploads
const uploadMiddleware = multer({ 
    dest: 'uploads/',
    limits: {
        fieldSize: 10 * 1024 * 1024,
    }});
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const path = require('path');

app.use(cors({credentials:true, origin:['http://localhost:3000', 'https://web-whispers-26c6dd91cb2b.herokuapp.com/']}));
app.use(express.json());
app.set("trust proxy", 1);
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads')); // Serve uploaded files statically

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        const userData = await User.create({
            username,
            password: bcrypt.hashSync(password, salt) // Hash password
        });
        
        res.json(userData);
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = await User.findOne({ username });
        if (!userData) {
            return res.status(400).json('Invalid username or password');
        };

        // Compare passwords
        const passwordCheck = bcrypt.compareSync(password, userData.password);

        // If passwords match, generate JWT token
        if (passwordCheck) {
            const token = jwt.sign({ username, id: userData._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: userData._id,
                    username,
                });
            });
        } else {
            res.status(400).json('Invalid username or password');
        }
    } catch (err) {
        res.status(500).json('Internal server error');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(200).json({ message: 'Authentication required' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.json({
            id: decoded.id,
            username: decoded.username,
        });
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token','').json('OK')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { title, highlight, content } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!highlight) {
            return res.status(400).json({ error: 'Highlight is required' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Backdrop file is required' });
        }

        // Validate backdrop file type
        const mimeType = req.file.mimetype;
        if (!mimeType.startsWith('image/')) {
            return res.status(400).json({ error: 'The backdrop file should be an image' });
        }

        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);

        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            let postData = {
                title,
                highlight,
                content,
                author: info.id,
                backdrop: newPath
            };

            postData = await Post.create(postData);
            res.json(postData);
        });
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;

    if (req.file) {
        // Rename and save uploaded file
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
    }

    // Verify token and update post    
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, highlight, content } = req.body;
        const postData = await Post.findById(id);

        if (!postData) {
            return res.status(404).json('Post not found');
        }

        if (postData.author.toString() !== info.id) {
            return res.status(403).json('You do not have the permission to edit this post.');
        }

        // Update post fields
        postData.title = title;
        postData.highlight = highlight;
        postData.content = content;
        if (newPath) {
            postData.backdrop = newPath;
        }

        await postData.save(); // Save updated post to database
        res.json(postData);
    });
});

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;

    try {
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
            fs.unlinkSync(postData.backdrop); // Delete associated image file
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        if (!res.headersSent) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: 'Invalid token' });
            } else {
                res.status(500).json('Internal server error');
            }
        }
    }
});

// Endpoint to retrieve all posts
app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
        );
});

// Endpoint to retrieve a specific post by ID
app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postData = await Post.findById(id).populate('author', ['username']);
    res.json(postData);
});

// Serve static files from frontend build directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/build/index.html"),
        function(err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

