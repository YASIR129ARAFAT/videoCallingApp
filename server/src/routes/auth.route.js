const express = require('express');

const {
    createUser,
    login,
    resetForgotPassword,
    resetFinalForgotPassword,
} = require('../controllers/auth.controller.js');


const router = express.Router();

router
    .post('/signup',
        createUser
    ) // /auth/signup
    .post('/login', login)
    .post('/reset/:id/:token', resetFinalForgotPassword)
    .post('/resetPassword', resetForgotPassword) // this is reset for forgot password case


exports.authRoute = router;