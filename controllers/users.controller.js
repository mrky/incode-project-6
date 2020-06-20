const UserSchema = require('../models/user.model');
const { setUser } = require('./auth.controllers');

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
                res.redirect('/');
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
        console.log('this is the answer:');
        UserSchema.displayProfile(req.session.id)
            .then(function (profile) {
                console.log('this is profile we are sending to ejs' + profile);
                res.render('profile', { title: 'Profile', profile: profile });
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
        UserSchema.updateProfile(
            req.body.id,
            req.body.firstName,
            req.body.surname,
            req.body.email,
            req.body.newPassword,
            function (err, db) {
                if (err) {
                    throw err;
                }

                //   var collection   = db.collection('users');
                //   var firstName = req.body.firstName;
                //   var surname = req.body.surname;
                //   var email = req.body.email;
                //   var password = req.body.password;
                //   var newPassword = req.body.newPassword;
                //   collection.update({'_id':new mongodb.ObjectID(req.params.id)},
                //   { $set: {'firstName': firstName, 'surname': surname, 'email': email, 'password': password, 'newPassword': newPassword } }, function(err, result) {
                //     if(err) { throw err; }
            }
        ).then(() => {
            console.log(profile)
            res.redirect('/users/profile');
        });

        //});
    },

    validate: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },
};
