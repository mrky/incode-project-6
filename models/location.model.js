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
    getLocations: (location = '') => {
        if (location == 'all') {
            searchLocation = {};
        } else {
            console.log(location);
            searchLocation = { $text: { $search: `"\"${location}\"" ` } };
        }

        return new Promise((resolve, reject) => {
            Location.find(searchLocation).then((location) => {
                if (location == null) {
                    reject(new Error('Location not found!'));
                }
                resolve(location);
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
};
