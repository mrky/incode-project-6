const bcrypt = require('bcryptjs');
const checkIfRecommended = require('../models/location.model').checkIfRecommended;
const checkIfApproved = require('../models/location.model').checkIfApproved;

module.exports = {
    setUser: (req, user) => {
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.loggedIn = true;
        req.session.isAdmin = user.isAdmin;
    },

    verifyUser: (req, res, next) => {
        if (req.session.loggedIn === true) {
            unsetRedirect(req);
            next();
        } else {
            setRedirect(req, res, next);
        }
    },

    verifyAdmin: (req, res, next) => {
        if (req.session.isAdmin === true) {
            unsetRedirect(req);
            next();
        } else {
            setRedirect(req, res, next);
        }
    },

    hashPassword: (password) => {
        let hashedPassword = bcrypt.hashSync(password, 10);
        console.log('hashedPassword is', hashedPassword);
        return hashedPassword;
    },

    allowRecommendation: (req, res, next) => {
        let locationId = req.params.id;
        let userId = req.session.userId;
        checkIfRecommended(locationId, userId)
            .then((alreadyRecommended) => {
                if (alreadyRecommended.yes === false) {
                    next();
                } else if (alreadyRecommended.yes === true) {
                    let would;
                    if (alreadyRecommended.recommended === 'yes') {
                        would = 'would';
                    } else {
                        would = 'would not';
                    }
                    let error = {
                        error: `You have already said you ${would} recommend this location.`,
                    };
                    res.json(error);
                }
            })
            .catch((err) => {
                console.log(err);
                next(err);
            });
    },

    isApproved: (req, res, next) => {
        checkIfApproved(req.params.id)
            .then((approved) => {
                if (approved === true) {
                    next();
                } else {
                    let error = {
                        message: 'Location has not been approved and therefore can not be viewed.',
                    };
                    next(error);
                }
            })
            .catch((err) => {
                next(err);
            });
    },
};

function setRedirect(req, res, next) {
    req.session.redirectTo = req.originalUrl;
    req.session.redirectSet = true;
    res.redirect('/users/login');
}

function unsetRedirect(req, res, next) {
    req.session.redirectTo = undefined;
    req.session.redirectSet = false;
    return;
}
