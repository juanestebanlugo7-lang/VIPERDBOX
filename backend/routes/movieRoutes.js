const express = require('express');
const auth = require('../middleware/authMiddleware');
const movieController = require('../controllers/movieController');

const router = express.Router();

// Rutas de películas (TMDB)
router.get('/popular', auth, movieController.getPopularMovies);
router.get('/search', auth, movieController.searchMovies);
router.get('/:id', auth, movieController.getMovieDetails);

// Rutas para reseñas y calificaciones (base de datos local)
router.post('/:id/reviews', auth, movieController.addReview);
router.get('/:id/reviews', auth, movieController.getMovieReviewsWithUser);
router.get('/:id/average', auth, movieController.getAverageRating);

module.exports = router;