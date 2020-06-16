const mongoose = require('mongoose')
const Schema = mongoose.Schema
const dbConnection = require('./db')

const LocationModel = new Schema({
    name: {
        type: String,
        require: true,
        unique: true 
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true,
    },
    recommendations: {
        type: Number,
        require: false
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'users',
        require: true
    },
    approved: {
        type: Boolean,
        default: false,
        require: true        
    },
    comments: [{

        comment: {
            type: String,
            require: false
        },
        author: {
            type: Schema.Types.ObjectId, 
            ref: 'users',
            require: true
        },
        
    }]
})
dbConnection.mongoose.model("locations", LocationModel)
const Location = dbConnection.mongoose.model('locations')

getLocations = (name = '') => {
    return new Promise((resolve, reject) => {
        Location.find().then((location) => {
            if (location == null) { reject(new Error('Location not found!')) }
            resolve(location);
        });
    });
}

module.exports = {
    getLocations
}