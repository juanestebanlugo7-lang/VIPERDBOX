const express = require('express');
const auth = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/stats', auth, getStats);

module.exports = router;