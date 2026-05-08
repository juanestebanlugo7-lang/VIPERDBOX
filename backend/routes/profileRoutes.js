const express = require('express');
const auth = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

const router = express.Router();


router.get('/me', auth, profileController.getMyProfile);

module.exports = router;