const tmdbService = require('../services/tmdbService');

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

// Detalle completo de película (con videos, créditos y reseñas)
// En backend/controllers/movieController.js
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
        console.error(`Error en getMovieDetails:`, error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
