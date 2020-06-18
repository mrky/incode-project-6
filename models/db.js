const debug = require('debug')('project6:db');
const mongoose = require('mongoose');
// const Database = 'mongodb://localhost/Location';
const database = 'mongodb://localhost:27017/project6';

//create connection with the project6 database
// mongoose.promise = global.promise;
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((db) => {
        debug('Connected to', db.connections[0].name);
        // console.log('Database Location connected');
    })
    .catch((err) => {
        debug('Error connecting to database.', err);
        // console.log('error');
    });

module.exports = {
    mongoose,
};
