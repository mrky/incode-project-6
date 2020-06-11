const express = require('express');
const router = express.Router();

const { displayCreateNew, createNewLocation, locationDetails } = require('../controllers/locations.controller');

// GET create new location page.
router.get('/create', displayCreateNew);

router.post('/create', createNewLocation);

router.get('/:id', locationDetails);


module.exports = router;
