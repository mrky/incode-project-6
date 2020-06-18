module.exports = {
    index: (req, res, next) => {
        // todo
        let { loggedIn } = req.session;
        console.log(loggedIn);

        let locations = [
            'australia',
            'barcelona',
            'canada',
            'disney_land',
            'france',
            'maldives',
            'newzealand',
            'paris',
        ];

        res.render('index', {
            title: 'All Locations',
            loggedIn,
            locations,
        });
    },
};
