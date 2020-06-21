const UserSchema = require('../models/user.model');
const { setUser } = require('./auth.controllers');
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
                    res.status(500).send(err.toString());
                })
            );
    },

    displayRegister: (req, res, next) => {
        res.render('users/register', {
            title: 'Register',
        });
    },

    register: (req, res, next) => {
        UserSchema.register(req.body)
            .then(function (user) {
                setUser(req, user);
                res.redirect('/');
            })
            .catch((err) =>
                setImmediate(() => {
                    console.log(err);
                    res.status(500).send(err.toString());
                })
            );
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

    // updateProfile: (req, res, next) => {
    //     UserSchema.updateProfile(req.session.id)
    //         .then(function (profile) {
    //             console.log('this is what we want to update' + profile)
    //             res.render('profile', {title:'Profile', profile : profile});
    //             console.log('the profile has been updated')
    //         })
    //         .catch((err) =>
    //             setImmediate(() => {
    //                 console.log(err);
    //                 res.status(500).send(err.toString());

    //             })

    //         );
    // },

    updateProfile: (req, res, next) => {
        let id = req.session.userId;
        let { firstName, surname, email } = req.body;
        let password = req.body.newPassword;
        let formData = {
            firstName,
            surname,
            email,
            password,
        };
        let updateData = {};
        debug('formDate', formData);
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== '') {
                updateData[key] = formData[key];
            }
        });

        debug('updateDate', updateData);
        /*  let form = [req.params.id,
            req.body.firstName,
            req.body.surname,
            req.body.email,
            req.body.newPassword];
            debug('form', form) */
        UserSchema.updateProfile(id, updateData, function (err, db) {
            if (err) {
                throw err;
            }
            res.redirect('/users/profile');

            //   var collection   = db.collection('users');
            //   var firstName = req.body.firstName;
            //   var surname = req.body.surname;
            //   var email = req.body.email;
            //   var password = req.body.password;
            //   var newPassword = req.body.newPassword;
            //   collection.update({'_id':new mongodb.ObjectID(req.params.id)},
            //   { $set: {'firstName': firstName, 'surname': surname, 'email': email, 'password': password, 'newPassword': newPassword } }, function(err, result) {
            //     if(err) { throw err; }
        })
            .then((profile) => {
                debug(profile);
                res.redirect('/users/profile');
            })
            .catch((err) => {
                next(err);
            });

        //});
    },

    validate: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },
};
