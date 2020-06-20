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
    displayLocationValidate,
    saveValidation,
} = require('../controllers/locations.controller');

const { verifyUser, verifyAdmin } = require('../controllers/auth.controllers');

// GET create new location page.
router.get('/display/:location', displayLocations);

router.get('/create', verifyUser, displayCreateNew);

// req.file is the `image` file
router.post('/create', [verifyUser, upload.single('image')], createNewLocation);

router.get('/validate', verifyAdmin, displayLocationValidate);

router.post('/validate/:id/:validate', verifyAdmin, saveValidation);

router.get('/id-:id', locationDetails);

router.get('/', (req, res, next) => {
    res.redirect('/');
});

module.exports = router;
