const User = require('../models/User');
const Review = require('../models/Review');
const List = require('../models/List'); // Única declaración

// Obtener perfil completo (usuario, reseñas, listas)
exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const reviews = await Review.getByUser(userId);
        const lists = await List.getUserListsWithMovies(userId);
        res.json({ user, reviews, lists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

// Agregar película a una lista
exports.addToList = async (req, res) => {
    const userId = req.user.id;
    const { listName } = req.params;
    const { movieId, movieTitle } = req.body;
    if (!movieId || !movieTitle) {
        return res.status(400).json({ error: 'Faltan datos de la película' });
    }
    try {
        await List.addMovieToList(userId, listName, movieId, movieTitle);
        res.json({ message: `Película agregada a ${listName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar a la lista' });
    }
};

// Eliminar película de una lista
exports.removeFromList = async (req, res) => {
    const userId = req.user.id;
    const { listName, movieId } = req.params;
    try {
        await List.removeMovieFromList(userId, listName, parseInt(movieId));
        res.json({ message: `Película eliminada de ${listName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar de la lista' });
    }
};

// Verificar si una película está en una lista
exports.checkInList = async (req, res) => {
    const userId = req.user.id;
    const { listName, movieId } = req.params;
    try {
        const inList = await List.isMovieInList(userId, listName, parseInt(movieId));
        res.json({ inList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar' });
    }
};