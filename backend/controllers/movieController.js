const tmdbService = require('../services/tmdbService');

exports.searchMovies = async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) return res.json({ results: [], total_pages: 0 });
  try {
    const data = await tmdbService.searchMovies(query, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar películas' });
  }
};

exports.getPopularMovies = async (req, res) => {
  const { page = 1 } = req.query;
  try {
    const data = await tmdbService.getPopularMovies(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener películas populares' });
  }
};

exports.getMovieDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await tmdbService.getMovieDetails(id);
    res.json({ movie });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener detalles' });
  }
};