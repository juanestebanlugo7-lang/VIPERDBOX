const db = require('../config/database');

class Like {
    static async toggle(reviewId, userId) {
        // Verificar si ya existe
        const existing = await db.query(
            'SELECT id FROM review_likes WHERE user_id = $1 AND review_id = $2',
            [userId, reviewId]
        );
        if (existing.rows.length > 0) {
            // Ya existe -> eliminar (unlike)
            await db.query('DELETE FROM review_likes WHERE user_id = $1 AND review_id = $2', [userId, reviewId]);
            return { liked: false };
        } else {
            // No existe -> insertar (like)
            await db.query('INSERT INTO review_likes (user_id, review_id) VALUES ($1, $2)', [userId, reviewId]);
            return { liked: true };
        }
    }

    static async countByReview(reviewId) {
        const result = await db.query('SELECT COUNT(*) as count FROM review_likes WHERE review_id = $1', [reviewId]);
        return parseInt(result.rows[0].count);
    }

    static async userLiked(reviewId, userId) {
        const result = await db.query('SELECT 1 FROM review_likes WHERE user_id = $1 AND review_id = $2', [userId, reviewId]);
        return result.rows.length > 0;
    }
}

module.exports = Like;