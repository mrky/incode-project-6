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
                res.render('users/login', { title: 'Login', loggedIn: true });
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
            res.render('index', { loggedIn: false });
        });
    },

    profile: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },
};
