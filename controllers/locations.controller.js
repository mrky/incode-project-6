const debug = require('debug')('project6:locations.c');
const LocationSchema = require('../models/location.model');
const fs = require('fs');
const path = require('path');

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
        let image = req.file;
        if (!image) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }
        debug('image is', image);
        let { name, description } = req.body;
        debug(`name is '${name}', description is '${description}'`);
        debug(JSON.stringify(req.file));
        let ext = path.extname(image.originalname);
        debug(ext);
        let mimetype = image.mimetype.split('/')[1];
        debug(mimetype);
        if (name === '' || description === '' || image === undefined) {
            return res.send('Please fill out form completely.');
        } else if (mimetype !== 'jpeg' && mimetype !== 'png') {
            return fs.unlink(image.path, (err) => {
                if (err) throw err;
                res.send('Only jpeg or png files may be uploaded.');
            });
        }
        // todo
        let tempPath = req.file.path;
        let targetPath = path.join(__dirname, './public/images/uploads/');
        res.send('respond with a resource');
    },

    locationDetails: (req, res, next) => {
        // todo
        // res.send('respond with a resource');
        res.render('locations/details');
    },
};
