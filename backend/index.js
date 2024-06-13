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
    }});
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

app.use(cors({credentials:true, origin:['http://localhost:3000', 'https://web-whispers-26c6dd91cb2b.herokuapp.com/']}));
app.use(express.json());
app.set("trust proxy", 1);
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/signup', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userData = await User.create({
            username,
            password:bcrypt.hashSync(password, salt)
        });  
        res.json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = await User.findOne({ username });
        if (!userData) {
            return res.status(400).json('Invalid username or password');
        };

        const passwordCheck = bcrypt.compareSync(password, userData.password);

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
        return res.status(401).json({ message: 'Authentication token is missing' });
    };
    jwt.verify(token, secret, (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        };
        res.json(info);
    });
});


app.post('/logout', (req, res) => {
    res.cookie('token','').json('OK')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, highlight, content} = req.body;
        const postData = await Post.create({
        title,
        highlight,
        content,
        backdrop:newPath,
        author:info.id,
    });
    res.json(postData); 
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;

    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
    }

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

        postData.title = title;
        postData.highlight = highlight;
        postData.content = content;
        if (newPath) {
            postData.backdrop = newPath;
        }

        await postData.save();

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

        // Delete the post
        await Post.findByIdAndDelete(id);

        // Delete the associated image file (optional)
        if (postData.backdrop) {
            fs.unlinkSync(postData.backdrop);
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

app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
        );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postData = await Post.findById(id).populate('author', ['username']);
    res.json(postData);
});

app.listen(PORT);
