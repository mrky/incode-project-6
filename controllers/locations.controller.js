const LocationSchema = require('../models/location.model');
module.exports = {
    displayLocations: (req, res, next) => {
        LocationSchema.getLocations(req.body)
            .then(function (locations) {
                console.log('Location: ' + locations);
                res.render('index', {
                    title: 'Locations',
                    locations: locations,
                });
            })
            .catch((err) =>
                setImmediate(() => {
                    console.log(err);
                    res.status(500).send(err.toString());
                })
            );
    },

    displayCreateNew: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },

    createNewLocation: (req, res, next) => {
        // todo
        res.send('respond with a resource');
    },

    locationDetails: (req, res, next) => {
        // todo
        // res.send('respond with a resource');
        res.render('locations/details');
    },
};
