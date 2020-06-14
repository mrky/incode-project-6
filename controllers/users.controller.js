const UserSchema = require('../models/user.model')
module.exports = {
    index: (req, res, next) => {
        res.render('users/login')
    }, 

    login: (req, res, next) => {
        UserSchema.login(req.body.email, req.body.password).then(function(user) {   
            req.session.email = user.email      
            req.session.isAdmin = user.isAdmin 
            res.render('index', {title:'Login', loggedIn : true})
        }).catch((err) => setImmediate(() => {console.log(err); res.status(500).send(err.toString())}));   
    },

    displayRegister: (req, res, next) => {
        res.render('users/register')
    },

    register: (req, res, next) => {
        UserSchema.register(req.body).then(function(user) {    
            res.render('users/login', {title:'Login', loggedIn : true})
        }).catch((err) => setImmediate(() => {console.log(err); res.status(500).send(err.toString())}));   
    },

    logout: (req, res, next) => {
        console.log('sessao '+req.session.email)
        req.session.destroy(function (err) {
            res.render('index', {isLogged : false})
        });
    },

    profile: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },
};
