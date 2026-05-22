const db = require('../config/database');

module.exports = async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    try {
        const result = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (result.rows[0]?.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso solo para administradores' });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error de servidor' });
    }
};