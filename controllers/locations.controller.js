const debug = require('debug')('project6:locations.c');
const LocationSchema = require('../models/location.model');
const fs = require('fs');
const path = require('path');

module.exports = {
    displayLocations: (req, res, next) => {
        LocationSchema.getLocations(req.params.location)
            .then(function (locations) {
                console.log('Location: ' + locations);
                res.render('index', {
                    title: `Results for "${req.params.location}"`,
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
        res.render('locations/create', {
            title: 'Create Location',
        });
    },

    createNewLocation: (req, res, next) => {
        function unlink(path) {
            fs.unlink(path, (err) => {
                if (err) throw err;
            });
        }

        let image = req.file;
        debug('image is:', image);

        if (!image) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }

        let { name, description } = req.body;
        let createdBy = req.session.userId;
        debug('name is', name);
        debug('description is', description);
        debug('createdBy is', createdBy);
        debug(JSON.stringify(req.file));
        let ext = path.extname(image.originalname).toLowerCase();
        debug('ext is:', ext);
        let mimetype = image.mimetype.split('/')[1];
        debug('mimetpye is:', mimetype);

        if (name === '' || description === '' || image === undefined) {
            return res.send('Please fill out form completely.');
        } else if (mimetype !== 'jpeg' && mimetype !== 'png') {
            unlink(image.path);
            return res.send('Only jpg or png files may be uploaded.');
        }

        if (ext !== '.jpg') {
            ext = `.${mimetype}`;
        }

        let tempPath = req.file.path;
        debug('tempPath is:', tempPath);

        let imagePath = '/images/uploads/' + req.file.filename.toString() + ext;
        let targetPath = path.join('./public', imagePath);

        let location = {
            name,
            description,
            imagePath,
            createdBy,
        };

        LocationSchema.createLocation(location)
            .then((uploaded) => {
                debug('uploaded', uploaded);
                fs.rename(tempPath, targetPath, (err) => {
                    if (err) throw err;
                    debug('File uploaded to', targetPath);
                });

                return res
                    .status(200)
                    .contentType('text/plain')
                    .end(
                        `Successfully created the location '${uploaded.name}'`
                    );
            })
            .catch((err) => {
                unlink(image.path);
                return res.json(err);
            });
    },

    locationDetails: (req, res, next) => {
        // TODO
        let { id } = req.params;
        debug('location id:', id);
        LocationSchema.getLocation(id)
            .then((location) => {
                res.render('locations/details', {
                    title: location.name,
                    location,
                });
            })
            .catch((err) => {
                let error = {
                    message: 'Location not found.',
                };
                next(error);
            });
    },

    displayLocationValidate: (req, res, next) => {
        LocationSchema.getLocationsToValidate(req.params.location)
            .then(function (locations) {
                res.render('locations/validate', {
                    title: `Results for "${req.params.location}"`,
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

    saveValidation: (req, res, next) => {
        LocationSchema.validateLocation(req.params.id, req.params.validate)
            .then(function (validate) {
                res.send(validate);
            })
            .catch((err) =>
                setImmediate(() => {
                    console.log(err);
                    res.status(500).send(err.toString());
                })
            );
    },

    recommendLocation: (req, res, next) => {
        let locationId = req.params.id;
        debug('location id is %s', locationId);
        let recommendation = req.body.recommendation;
        debug('recommendation is', recommendation);
        let userId = req.session.userId;
        debug('userId is', userId);
        if (recommendation !== '') {
            LocationSchema.recommendLocation(locationId, recommendation, userId)
                .then(function (saved) {
                    let recommended;
                    if (recommendation === 'yes') {
                        would = 'would recommend'
                    } else {
                        would = 'would not recommend'
                    }
                    let obj = {
                        success: `Recommendation saved. You said you ${would} this location.`
                    }
                    res.json(obj);
                })
                .catch((err) =>
                    setImmediate(() => {
                        console.log(err);
                        res.json(err);
                    })
                );
        } else {
            let error = new Error('Recommendation not set.');
            next(error);
        }
    },
};
