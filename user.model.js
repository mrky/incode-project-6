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
        require: true
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

login = (email, password) => {    
    const User = dbConnection.mongoose.model('users')    
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }).then((user) => {
            if (user == null) { reject(new Error('E-mail not found. Please check you email!')) }    
            if (user.password != password)  { reject(new Error('Your password is invalid!')) }    
            resolve(user);
        });
    });
}


module.exports = {
    login
}