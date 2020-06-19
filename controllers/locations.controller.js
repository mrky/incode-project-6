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
        // todo
        res.send('respond with a resource');
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

        // TODO
        // get createdBy from session
        let { name, description, createdBy } = req.body;
        debug(`name is: '${name}', description: is '${description}, createdBy is: ${createdBy}'`);
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
                return res.json(err);
            });
    },

    locationDetails: (req, res, next) => {
        // todo
        // res.send('respond with a resource');
        res.render('locations/details');
    },
};
