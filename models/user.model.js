const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('./db');

const UserModel = new Schema({
    firstName: {
        type: String,
        required: true,
    },

    surname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
    
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
});
dbConnection.mongoose.model('users', UserModel);
const User = dbConnection.mongoose.model('users');

login = (email, password) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }).then((user) => {
            if (user == null) {
                reject(new Error('E-mail not found. Please check you email!'));
            }
            if (user.password != password) {
                reject(new Error('Your password is invalid!'));
            }
            resolve(user);
        });
    });
};

register = (user) => {
    if (user.password != user.repassword) {
        console.log('Password and Re-enter password do not match!');
    } else {
        const newUser = {
            firstName: user.firstname,
            surname: user.surname,
            email: user.email,
            password: user.password,
            isAdmin: false,
        };

        return new Promise((resolve, reject) => {
            new User(newUser)
                .save()
                .then((user) => {
                    resolve(user);
                })
                .catch((err) =>
                    setImmediate(() => {
                        reject(new Error(err));
                    })
                );
        });
    }
};

module.exports = {
    login,
    register,
};
