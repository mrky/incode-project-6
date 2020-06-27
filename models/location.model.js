const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('./db');
const debug = require('debug')('project6:location.m');

const locationModel = new Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    imagePath: {
        type: String,
        required: true,
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    approved: {
        type: Boolean,
        default: false,
        required: true,
    },

    recommendations: {
        type: Object,
        yes: {
            type: Object,
        },
        no: {
            type: Object,
        },
        required: false,
    },

    comments: {
        type: new Schema({
            comment: { type: String, required: true },
            author: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true,
            },
        }),
        required: false,
    },
});

locationModel.index({ name: 'text' });

let Location = dbConnection.mongoose.model('locations', locationModel);
// Location.ensureIndexes();

module.exports = {
    getLocations: (location = 'all') => {
        if (location === 'all') {
            searchLocation = {};
        } else {
            console.log(location);
            searchLocation = { $text: { $search: `"\"${location}\"" ` } };
        }

        return new Promise((resolve, reject) => {
            Location.find(searchLocation)
                .then((location) => {
                    if (location == null) {
                        reject(new Error('Location not found!'));
                    }
                    resolve(location);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    getApprovedLoactions: () => {
        return new Promise((resolve, reject) => {
            Location.find({ approved: true })
                .then((locations) => {
                    if (!locations.length) {
                        locations = {
                            empty: true,
                            message: 'No locations found.',
                        };
                    }
                    debug(locations);
                    resolve(locations);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    createLocation: (location) => {
        return new Promise((resolve, reject) => {
            Location(location).save(function (err, uploaded) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log('model', true);
                resolve(uploaded);
            });
        });
    },

    getLocation: (id) => {
        return new Promise((resolve, reject) => {
            Location.findById(id, function (err, location) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log('getLocation', location);
                resolve(location);
            });
        });
    },

    getLocationsToValidate: () => {
        console.log('retorna somente o que tem para ser validado');
        return new Promise((resolve, reject) => {
            Location.find({ approved: false }).then((location) => {
                if (location == null) {
                    reject(new Error('There are no locations to validate!'));
                }
                resolve(location);
            });
        });
    },

    validateLocation: (id, approved) => {
        return new Promise((resolve, reject) => {
            Location.update({ _id: id }, { $set: { approved: approved } }).then(
                (result) => {
                    if (result.nModified == 0) {
                        reject(
                            new Error(
                                'Location was not  are no locations to validate!'
                            )
                        );
                    }
                    resolve(approved);
                }
            );
        });
    },

    recommendLocation: (locationId, recommendation, userId) => {
        const filter = { _id: locationId };
        let push = 'recommendations.' + recommendation;
        debug('push is', push);
        const update = { $push: { [push]: userId } };
        return new Promise((resolve, reject) => {
            Location.findByIdAndUpdate(locationId, update, {
                new: true,
            })
                .then((result) => {
                    debug('recommend result', result);

                    if (result !== null) {
                        if (result.nModified == 0) {
                            debug('update result nM', result);
                            reject(new Error('0 rows were modified!'));
                        }
                    } else {
                        let error = new Error('Location does not exist.');
                        reject('Location does not exist.');
                    }
                    resolve(result);
                })
                .catch((err) => {
                    debug('');
                    reject(err);
                });
        });
    },

    checkIfRecommended: (locationId, userId) => {
        let checkYes = 'recommendations.yes';
        let checkNo = 'recommendations.no';
        return new Promise((resolve, reject) => {
            Location.find({ _id: locationId })
                .or([{ [checkYes]: userId }, { [checkNo]: userId }])
                .then((result) => {
                    if (result.length) {
                        debug('checkifrec result.recommendations', result[0].recommendations);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch(err => {
                    reject(err);
                });
        });
    },
};
