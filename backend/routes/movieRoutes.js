const express = require('express');
const { searchMovies, getPopularMovies, getMovieDetails } = require('../controllers/movieController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/search', auth, searchMovies);
router.get('/popular', auth, getPopularMovies);
router.get('/:id', auth, getMovieDetails);

module.exports = router;