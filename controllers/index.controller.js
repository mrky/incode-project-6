const debug = require('debug')('project6:index.c');
const LocationSchema = require('../models/location.model');

module.exports = {
    index: (req, res, next) => {
        LocationSchema.getApprovedLoactions()
            .then(function (locations) {
                debug('Locations:', locations);
                res.render('index', {
                    title: 'All Locations',
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
};
