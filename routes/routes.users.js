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

// GET users login page.
router.get('/login', index);

router.post('/login', login);

router.get('/register', displayRegister);

router.post('/register', register);

router.get('/logout', logout);

router.get('/profile', profile);

router.post('/profile/:id', updateProfile);

module.exports = router;
