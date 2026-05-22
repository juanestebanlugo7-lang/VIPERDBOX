const db = require('../config/database');

class Review {
    // Crear una nueva reseña
    static async create(reviewData) {
        const { userId, movieId, movieTitle, rating, content } = reviewData;
        const result = await db.query(
            `INSERT INTO reviews (user_id, movie_id, movie_title, rating, content)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [userId, movieId, movieTitle, rating, content]
        );
        return result.rows[0].id;
    }

    // Obtener reseñas de una película (con datos del usuario)
    static async getByMovie(movieId) {
        const result = await db.query(
            `SELECT r.*, u.name as user_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.movie_id = $1
             ORDER BY r.created_at DESC`,
            [movieId]
        );
        return result.rows;
    }

    // Obtener promedio de calificaciones de una película (solo usuarios Viperdbox)
    static async getAverageRating(movieId) {
        const result = await db.query(
            `SELECT AVG(rating) as average, COUNT(*) as total
             FROM reviews
             WHERE movie_id = $1`,
            [movieId]
        );
        return {
            average: result.rows[0].average ? parseFloat(result.rows[0].average).toFixed(1) : null,
            total: parseInt(result.rows[0].total)
        };
    }

    // Obtener reseñas de un usuario (para perfil)
    static async getByUser(userId) {
        const result = await db.query(
            `SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    }
}

module.exports = Review;