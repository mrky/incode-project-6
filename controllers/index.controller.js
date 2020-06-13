module.exports = {
    index: (req, res, next) => {
        // todo
        let loggedIn = true;

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
