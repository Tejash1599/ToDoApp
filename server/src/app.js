const express = require('express');
const mongoose = require('mongoose');
// const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
const passport = require('./config/passport');
const session = require("express-session");
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const todoRoutes= require('./routes/todoRoutes');
require('dotenv').config();
// dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
    methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());


app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.get('/auth/google',passport.authenticate("google",{scope : ["profile","email"]}));
app.get('/auth/google/callback',passport.authenticate("google",{failureRedirect:'/'}),(req,res)=>{
    const token = jwt.sign({id : req.user.id,email : req.user.email}, process.env.JWT_ACCESS_SECRET,{expiresIn:"1d"});

    res.cookie("token",token,{
        httpOnly : true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    // res.json({
    //     message: "Login Successful",
    //     user : {
    //         id : req.user.id,
    //         name : req.user.name,
    //         email : req.user.email,
    //         picture: req.user.picture,
    //     },
    //     token : token
    // });
    res.redirect('http://localhost:3000/todos');
});

app.get('/profile', authMiddleware,(req,res)=>{
    res.json({
        message : 'Protected route created',
        user : req.user
    });
});

// Logout Route to clear the JWT cookie and log the user out
app.post('/auth/logout', (req, res) => {
    // Clear the JWT cookie by setting it to expire in the past
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only for HTTPS in production
        sameSite: "strict"
    });

    // Redirect user to the login page (or any other page you prefer)
    res.status(200).json({ message: 'Logged out successfully' });
});


app.use("/todos",todoRoutes);

connectDB();
const PORT = process.env.PORT ||  5000;
app.listen(PORT, ()=> console.log( `API running on http://localhost:${PORT}`));