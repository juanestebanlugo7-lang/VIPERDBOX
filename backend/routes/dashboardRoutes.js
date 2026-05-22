const express = require('express');
const auth = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

router.get('/', auth, dashboardController.getStats);

module.exports = router;