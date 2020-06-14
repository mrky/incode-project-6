const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const dbConnection = require('./db')

const UserModel = new Schema({
    firstName: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        require: true
    }
})
dbConnection.mongoose.model("users", UserModel)
const User = dbConnection.mongoose.model('users')

login = (email, password) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }).then((user) => {
            if (user == null) { reject(new Error('E-mail not found. Please check you email!')) }
            if (user.password != password) { reject(new Error('Your password is invalid!')) }
            resolve(user);
        });
    });
}
 
register = (user) => {
    if (user.password != user.repassword) {
        console.log('Password and Re-enter password do not match!')
    } else {
        const newUser = {
            firstName: user.firstName,
            surname: user.surname,
            email: user.email,
            password: user.password,
            isAdmin: true
        }

        return new Promise((resolve, reject) => {
            new User(newUser).save().then((user) => {
                resolve(user);
            }).catch((err) => setImmediate(() => { reject(new Error(err)) }));
        })
    }
}

module.exports = {
    login,
    register
}