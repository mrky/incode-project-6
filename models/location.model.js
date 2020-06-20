const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnection = require('./db');

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
        type: Number,
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
};
