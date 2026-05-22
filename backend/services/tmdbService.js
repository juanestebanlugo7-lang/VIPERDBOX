const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;
const IMAGE_URL = process.env.TMDB_IMAGE_URL;

class TmdbService {
  static async searchMovies(query, page = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query, page, language: 'es-ES' }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB search error', error);
      return { results: [], total_pages: 0 };
    }
  }
  // En backend/services/tmdbService.js
static async getMovieDetails(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: { api_key: API_KEY, language: 'es-ES' }
        });
        return response.data;
    } catch (error) {
        console.error(`TMDB Error (${movieId}):`, error.response?.status, error.message);
        // Si es 404 (no encontrada), retornamos null
        if (error.response && error.response.status === 404) {
            return null;
        }
        // Para otros errores (red, API key inválida), también retornamos null (pero logueamos)
        console.error('Error grave en getMovieDetails:', error.message);
        return null;
    }
}

  static async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: { api_key: API_KEY, page, language: 'es-ES' }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB popular error', error);
      return { results: [], total_pages: 0 };
    }
  }

  static async getMovieVideos(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
            params: { api_key: API_KEY, language: 'es-ES' }
        });
        const trailers = response.data.results.filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'));
        return trailers;
    } catch (error) {
        console.error('Error getting videos', error);
        return [];
    }
}

static async getMovieCredits(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
            params: { api_key: API_KEY, language: 'es-ES' }
        });
        return response.data.cast.slice(0, 12);
    } catch (error) {
        console.error('Error getting credits', error);
        return [];
    }
}

static async getMovieReviews(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}/reviews`, {
            params: { api_key: API_KEY, language: 'es-ES' }
        });
        return response.data.results.slice(0, 5);
    } catch (error) {
        console.error('Error getting reviews', error);
        return [];
    }
}
}

module.exports = TmdbService;