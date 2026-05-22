const db = require('../config/database');

exports.getStats = async (req, res) => {
    try {
        // Total de usuarios
        const totalUsers = await db.query('SELECT COUNT(*) as count FROM users');
        // Total de reseñas
        const totalReviews = await db.query('SELECT COUNT(*) as count FROM reviews');
        // Calificación promedio (de todas las reseñas)
        const avgRating = await db.query('SELECT AVG(rating)::numeric(10,2) as avg FROM reviews');
        // Películas más comentadas (top 5)
        const topMovies = await db.query(`
            SELECT movie_id, movie_title, COUNT(*) as review_count, AVG(rating)::numeric(10,2) as avg_rating
            FROM reviews
            GROUP BY movie_id, movie_title
            ORDER BY review_count DESC
            LIMIT 5
        `);
        // Actividad reciente (últimas 10 reseñas)
      const recentActivity = await db.query(`
    SELECT r.*, u.name as user_name, u.id as user_id
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 10
`);

        res.json({
            totalUsers: parseInt(totalUsers.rows[0].count),
            totalReviews: parseInt(totalReviews.rows[0].count),
            avgRating: parseFloat(avgRating.rows[0].avg) || 0,
            topMovies: topMovies.rows,
            recentActivity: recentActivity.rows
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};