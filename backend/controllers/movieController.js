const tmdbService = require('../services/tmdbService');
const Review = require('../models/Review');  // Asegúrate de que este modelo exista

// Obtener películas populares
exports.getPopularMovies = async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const data = await tmdbService.getPopularMovies(page);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener películas populares' });
    }
};

// Búsqueda de películas
exports.searchMovies = async (req, res) => {
    const { query, page = 1 } = req.query;
    if (!query) return res.json({ results: [], total_pages: 0 });
    try {
        const data = await tmdbService.searchMovies(query, page);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
};

// Detalle completo (TMDB + videos + créditos + reseñas TMDB)
exports.getMovieDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await tmdbService.getMovieDetails(id);
        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        const videos = await tmdbService.getMovieVideos(id);
        const credits = await tmdbService.getMovieCredits(id);
        const reviews = await tmdbService.getMovieReviews(id);
        res.json({ movie, videos, credits, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener detalles de la película' });
    }
};

// ========== RESEÑAS Y CALIFICACIONES LOCALES ==========

// Agregar una reseña (calificación 1-10)
exports.addReview = async (req, res) => {
    const userId = req.user.id;
    const movieId = req.params.id;
    const { rating, content } = req.body;

    if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ error: 'La calificación debe ser entre 1 y 10' });
    }
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'El contenido de la reseña no puede estar vacío' });
    }

    try {
        // Obtener título de la película desde TMDB
        const movie = await tmdbService.getMovieDetails(movieId);
        if (!movie) return res.status(404).json({ error: 'Película no encontrada' });

        const reviewId = await Review.create({
            userId,
            movieId,
            movieTitle: movie.title,
            content: content.trim(),
            rating
        });
        res.status(201).json({ message: 'Reseña publicada', reviewId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la reseña' });
    }
};

// Obtener reseñas de una película (con datos del usuario)
exports.getMovieReviewsWithUser = async (req, res) => {
    const movieId = req.params.id;
    try {
        const reviews = await Review.getByMovieWithUser(movieId);
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

// Obtener promedio de calificaciones de una película (desde nuestra BD)
exports.getAverageRating = async (req, res) => {
    const movieId = req.params.id;
    try {
        const avg = await Review.getAverageRating(movieId);
        res.json(avg);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener promedio' });
    }
};
const Like = require('../models/Like');

exports.toggleLike = async (req, res) => {
    const userId = req.user.id;
    const reviewId = req.params.id;
    try {
        const result = await Like.toggle(reviewId, userId);
        const newCount = await Like.countByReview(reviewId);
        res.json({ liked: result.liked, count: newCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar like' });
    }
};

exports.getLikeCount = async (req, res) => {
    const reviewId = req.params.id;
    try {
        const count = await Like.countByReview(reviewId);
        const liked = req.user ? await Like.userLiked(reviewId, req.user.id) : false;
        res.json({ count, liked });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
};