const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// SET STORAGE
const storage = multer.diskStorage({
    destination: path.join('/uploads'),

    filename: function (req, file, cb) {
        let { name } = req.body;
        name = name.replace(/ /g, '_').toLowerCase();
        cb(null, name + '-' + Date.now());
    },
});

// 2MB file limit
const multerOptions = {
    storage,
    limits: {
        'fileSize': 2000000
    }
};

const upload = multer(multerOptions);

const {
    displayCreateNew,
    createNewLocation,
    locationDetails,
    displayLocations,
    displayLocationValidate,
    saveValidation,
    recommendLocation,
} = require('../controllers/locations.controller');

const { verifyUser, verifyAdmin, allowRecommendation } = require('../controllers/auth.controllers');

// GET create new location page.
router.get('/display/:location', displayLocations);

router.get('/create', verifyUser, displayCreateNew);

// req.file is the `image` file
router.post('/create', [verifyUser, upload.single('image')], createNewLocation);

router.get('/validate', verifyAdmin, displayLocationValidate);

router.post('/validate/:id/:validate', verifyAdmin, saveValidation);

router.get('/id-:id', locationDetails);

router.post('/recommend/id-:id', allowRecommendation, recommendLocation);

router.get('/', (req, res, next) => {
    res.redirect('/');
});

module.exports = router;
