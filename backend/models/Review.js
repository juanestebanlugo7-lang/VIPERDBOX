const db = require('../config/database');

class Review {
    static async create({ userId, movieId, movieTitle, content, rating }) {
        const result = await db.query(
            `INSERT INTO reviews (user_id, movie_id, movie_title, content, rating)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [userId, movieId, movieTitle, content, rating]
        );
        return result.rows[0].id;
    }

    static async getByMovieWithUser(movieId) {
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
    static async getByUser(userId) {
    const result = await db.query(
        `SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
}

    static async getAverageRating(movieId) {
        const result = await db.query(
            `SELECT COALESCE(AVG(rating), 0)::numeric(10,2) as average, COUNT(*) as total
             FROM reviews
             WHERE movie_id = $1`,
            [movieId]
        );
        return {
            average: parseFloat(result.rows[0].average),
            total: parseInt(result.rows[0].total)
        };
    }
}

module.exports = Review;