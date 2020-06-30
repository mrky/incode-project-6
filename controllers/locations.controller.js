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
        if (req.session.createData !== undefined) {
            res.locals.data = req.session.createData;
            req.session.createData = undefined;
        } else {
            res.locals.data = {
                input: {},
                message: {},
            };
        }
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

        let { name, description } = req.body;
        let image = req.file;
        debug('image is:', image);

        req.session.createData = data = {
            input: {},
            message: {},
        };

        if (!image) {
            data.input.name = name;
            data.input.description = description;
            data.message.class = 'alert-danger';
            data.message.text = 'Please upload an image.';
            return res.redirect('/locations/create');
        }

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
            data.input.name = name;
            data.input.description = description;
            data.message.class = 'alert-danger';
            data.message.text = 'Please fill out form completely.';
            return res.redirect('/locations/create');
        } else if (mimetype !== 'jpeg' && mimetype !== 'png') {
            unlink(image.path);
            data.input.name = name;
            data.input.description = description;
            data.message.class = 'alert-danger';
            data.message.text = 'Only .jpg or .png files may be uploaded.';
            return res.redirect('/locations/create');
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

                data.message.class = 'alert-success';
                data.message.text = `Successfully created the location '${uploaded.name}'.`;
                return res.redirect('/locations/create');
            })
            .catch((err) => {
                unlink(image.path);
                return next(err);
            });
    },

    locationDetails: async (req, res, next) => {
        try {
            let locationId = req.params.id;
            let { userId } = req.session;
            debug('location id:', locationId);

            let alreadyRecommended = await LocationSchema.checkIfRecommended(
                locationId,
                userId
            );
            debug('alredy recommended is:', alreadyRecommended);

            let allowRecommend = {
                yes: true,
            };

            if (alreadyRecommended.yes === true) {
                allowRecommend.yes = false;
                let would;
                if (alreadyRecommended.recommended === 'yes') {
                    would = 'would';
                } else {
                    would = 'would not';
                }
                allowRecommend.message = `You said you ${would} recommend this location.`;
            }

            LocationSchema.getLocation(locationId)
                .then((location) => {
                    debug('location is:', location);
                    res.render('locations/details', {
                        title: location.name,
                        location,
                        allowRecommend,
                    });
                })
                .catch((err) => {
                    debug('locationDetails err:', err);
                    let error = {
                        message: 'Location not found.',
                    };
                    next(error);
                });
        } catch (err) {
            debug('locationDetails catch err:', err);
            next(err);
        }
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
                        would = 'would recommend';
                    } else {
                        would = 'would not recommend';
                    }
                    let obj = {
                        success: `Recommendation saved. You said you ${would} this location.`,
                    };
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

    addComment: (req, res, next) => {
        let { comment } = req.body;
        debug('comment is:', comment);
        let author = req.session.userId;
        let locationId = req.params.id;
        LocationSchema.addComment(locationId, comment, author)
            .then(function (added) {
                res.send('Comment added successfully');
            })
            .catch((err) => {
                debug('addComment catch err:', err);
                res.send('Error adding comment');
            });
    },
};
