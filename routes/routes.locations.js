const express = require('express');
const router = express.Router();

const { displayCreateNew, createNewLocation, locationDetails, displayLocations } = require('../controllers/locations.controller');

// GET create new location page.
router.get('/', displayLocations);

router.get('/create', displayCreateNew);

router.post('/create', createNewLocation);

router.get('/:id', locationDetails);


module.exports = router;
