const UserSchema = require('../models/user.model');
const { setUser, hashPassword } = require('./auth.controllers');
const debug = require('debug')('project6:users.c');

module.exports = {
    index: (req, res, next) => {
        res.render('users/login', {
            title: 'Login',
        });
    },

    login: (req, res, next) => {
        UserSchema.login(req.body.email, req.body.password)
            .then(function (user) {
                setUser(req, user);
                if (req.session.redirectTo) {
                    res.redirect(req.session.redirectTo);
                } else {
                    res.redirect('/');
                }
            })
            .catch((err) =>
                setImmediate(() => {
                    console.log(err);
                    next(err);
                    // res.status(500).send(err.toString());
                })
            );
    },

    displayRegister: (req, res, next) => {
        res.render('users/register', {
            title: 'Register',
        });
    },

    register: (req, res, next) => {
        if (req.body.password !== req.body.repassword) {
            let error = new Error('Entered passwords do not match. Please try again.');
            next(error);
        } else {
            let user = {
                firstName: req.body.firstname,
                surname: req.body.surname,
                email: req.body.email,
                password: hashPassword(req.body.password)
            };

            UserSchema.register(user)
                .then(function (user) {
                    setUser(req, user);
                    res.redirect('/');
                })
                .catch((err) =>
                    setImmediate(() => {
                        console.log(err);
                        next(err);
                        // res.status(500).send(err.toString());
                    })
                );
        }
    },

    logout: (req, res, next) => {
        console.log('sessao ' + req.session.email);
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    },

    profile: (req, res, next) => {
        console.log('this is the answer:', req.session.userId);
        UserSchema.displayProfile(req.session.userId)
            .then(function (profile) {
                console.log('this is profile we are sending to ejs' + profile);
                res.render('users/profile', {
                    title: 'Profile',
                    profile: profile,
                });
            })
            .catch((err) =>
                setImmediate(() => {
                    console.log(err);
                    res.status(500).send(err.toString());
                })
            );
    },

    updateProfile: (req, res, next) => {
        let id = req.session.userId;
        let { firstName, surname, email } = req.body;

        let password = req.body.newPassword;
        if (password !== '') {
            password = hashPassword(password)
        }

        let formData = {
            firstName,
            surname,
            email,
            password,
        };

        let updateData = {};
        debug('formData', formData);

        Object.keys(formData).forEach((key) => {
            if (formData[key] !== '') {
                updateData[key] = formData[key];
            }
        });
        debug('updateData', updateData);

        UserSchema.updateProfile(id, updateData)
            .then((profile) => {
                debug('returned profile after update function %s',profile);
                res.redirect('/users/profile');
            })
            .catch((err) => {
                next(err);
            });
    },

    validate: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },
};
