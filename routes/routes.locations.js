const express = require('express');
const router = express.Router();

const multer = require('multer');
// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },

    filename: function (req, file, cb) {
        let { name } = req.body;
        name = name.replace(/ /g, '_').toLowerCase();
        cb(null, name + '-' + Date.now());
    },
});
const upload = multer({ storage: storage });

const {
    displayCreateNew,
    createNewLocation,
    locationDetails,
    displayLocations,
} = require('../controllers/locations.controller');

const { verifyUser } = require('../controllers/auth.controllers');

// GET create new location page.
router.get('/', displayLocations);

router.get('/create', verifyUser, displayCreateNew);

// req.file is the `image` file
router.post('/create', [verifyUser, upload.single('image')], createNewLocation);

router.get('/:id', verifyUser, locationDetails);

module.exports = router;
