const express = require('express');
const router = express.Router();

const { displayLocations, displayCreateNew, createNewLocation, locationDetails } = require('../controllers/locations.controller');

// GET create new location page.
router.get('/display/:location', displayLocations);

router.get('/create', displayCreateNew);

router.post('/create', createNewLocation);

router.get('/:id', locationDetails);
 
module.exports = router;
