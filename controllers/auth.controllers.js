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
