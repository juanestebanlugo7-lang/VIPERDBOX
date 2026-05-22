const express = require('express');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Todas las rutas requieren autenticación y rol admin
router.get('/dashboard', auth, admin, adminController.getDashboard);
router.delete('/reviews/:id', auth, admin, adminController.deleteReview);

module.exports = router;