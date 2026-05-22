const db = require('../config/database');

// Obtener datos para el panel de administración
exports.getDashboard = async (req, res) => {
    try {
        const users = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id');
        const reviews = await db.query(`
            SELECT r.*, u.name as user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            ORDER BY r.created_at DESC
        `);
        const stats = {
            totalUsers: users.rows.length,
            totalReviews: reviews.rows.length,
            totalMovies: new Set(reviews.rows.map(r => r.movie_id)).size
        };
        res.json({ stats, users: users.rows, reviews: reviews.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener datos del panel' });
    }
};

// Eliminar una reseña (solo admin)
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM reviews WHERE id = $1', [id]);
        res.json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la reseña' });
    }
};

// Cambiar rol de usuario (opcional, para promocionar admin)
exports.changeUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body; // 'admin' o 'user'
    if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Rol inválido' });
    }
    try {
        await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
        res.json({ message: 'Rol actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar rol' });
    }
};