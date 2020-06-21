const express = require('express');
const router = express.Router();

const {
    index,
    login,
    displayRegister,
    register,
    logout,
    profile,
    updateProfile,
} = require('../controllers/users.controller');

const { verifyUser } = require('../controllers/auth.controllers');

// GET users login page.
router.get('/login', index);

router.post('/login', login);

router.get('/register', displayRegister);

router.post('/register', register);

router.get('/logout', logout);

router.get('/profile', verifyUser, profile);

router.post('/profile', verifyUser, updateProfile);

module.exports = router;
