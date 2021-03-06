const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('./db');
const debug = require('debug')('project6:user.m');
const bcrypt = require('bcryptjs');

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

// dbConnection.mongoose.model('users', UserModel);
const User = dbConnection.mongoose.model('users', UserModel);

let login = (email, password) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }).then((user) => {
            if (user == null) {
                reject(new Error('Email not found. Please check your email!'));
            }
            if (!bcrypt.compareSync(password, user.password)) {
                reject(new Error('Wrong password!'));
            }
            resolve(user);
        });
    });
};

let register = (user) => {
    const newUser = {
        firstName: user.firstName,
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
};

let displayProfile = (id) => {
    console.log('we are in profile method' + id);
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) {
                console.log(err);
                reject(err);
            }
            debug('displayProfile', user);
            resolve(user);
        });

        // User.findOne({ surname: "hickey" }).then((user) => {
        //   console.log(user)
        //     resolve(user);
        // })
    });
};

let updateProfile = (id, values) => {
    console.log('am in the update profile method');
    debug(id);
    debug(values);
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            $set: values,
            function(err, user) {
                debug('err is', err);
                debug('user is', user);
                reject(err);
                resolve(user);
            },
        })
            .then((success) => {
                debug('success is', success);
                resolve(success);
            })
            .catch((err) => {
                debug('err is', err);
                reject(err);
            });
    });
};

module.exports = {
    login,
    register,
    displayProfile,
    updateProfile,
};
