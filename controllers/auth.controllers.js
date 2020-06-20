module.exports = {
    setUser: (req, user) => {
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.loggedIn = true;
        req.session.isAdmin = user.isAdmin;
    },

    verifyUser: (req, res, next) => {
        if (req.session.loggedIn === true) {
            next();
        } else {
            return res.sendStatus(403);
        }
    },

    verifyAdmin: (req, res, next) => {
        if (req.session.isAdmin === true) {
            next();
        } else {
            return res.sendStatus(403);
        }
    },
};
