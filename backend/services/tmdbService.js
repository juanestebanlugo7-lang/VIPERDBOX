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

  static async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: { api_key: API_KEY, language: 'es-ES' }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB details error', error);
      return null;
    }
  }
}

module.exports = TmdbService;