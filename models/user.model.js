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
                reject(new Error('Email not found. Please check your email!'));
            }
            if (user.password != password) {
                reject(new Error('Your passwords do not match!'));
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

displayProfile = (id) => {
    console.log('we are in profile method' + id)
    return new Promise((resolve, reject) => {
        User.findOne({ surname: "hickey" }).then((user) => {
          console.log(user)                         
            resolve(user);
        })
    });
}

 updateProfile = (_id,firstName,surname,email, password) => {
     console.log('am in the update profile method')
     return new Promise((resolve, reject) => {
         User.updateOne({surname: "hickey"}, 
         { $set: {'firstName': firstName, 'surname': surname, 'email': email, 'password': password, }, function(err, user) { 
            console.log(user)
            resolve(user);
         }
    
        
        })
    
       })
 }, 

module.exports = {
    login,
    register,
    displayProfile,
    updateProfile,
};
