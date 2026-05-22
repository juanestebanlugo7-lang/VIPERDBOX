const express = require('express');
const auth = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/me', auth, profileController.getMyProfile);
router.post('/lists/:listName', auth, profileController.addToList);
router.delete('/lists/:listName/:movieId', auth, profileController.removeFromList);
router.get('/lists/:listName/:movieId/check', auth, profileController.checkInList); 
router.get('/user/:id', auth, profileController.getOtherProfile);
module.exports = router;