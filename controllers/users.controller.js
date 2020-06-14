const UserSchema = require('../models/user.model');
module.exports = {
    index: (req, res, next) => {
        res.render('users/login', {
            title: 'Login',
        });
    },

    login: (req, res, next) => {
        console.log('se' + req.body.password);
        UserSchema.login(req.body.email, req.body.password)
            .then(function (user) {
                console.log('usu ' + user);
                req.session.email = user.email;
                req.session.isAdmin = user.isAdmin;
                console.log('sessao ' + req.session.firstName);
                res.render('index', { title: 'Login', loggedIn: true });
            })
            .catch((err) =>
                setImmediate(() => {
                    console.log(err);
                    res.status(500).send(err.toString());
                })
            );
    },

    displayRegister: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },

    register: (req, res, next) => {
        // todo
        res.send('respond with a resource');
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
