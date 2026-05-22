const db = require('../config/database');

class List {
    // Crear listas por defecto al registrar usuario
    static async createDefaultLists(userId) {
        const lists = ['favoritas', 'pendientes', 'vistas'];
        for (const name of lists) {
            await db.query(
                'INSERT INTO lists (user_id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [userId, name]
            );
        }
    }

    // Obtener listas con películas (para el perfil)
    static async getUserListsWithMovies(userId) {
        const result = await db.query(
            `SELECT l.id, l.name,
                COALESCE(
                    json_agg(
                        json_build_object('id', lm.movie_id, 'title', lm.movie_title)
                    ) FILTER (WHERE lm.movie_id IS NOT NULL), '[]'
                ) as movies
             FROM lists l
             LEFT JOIN list_movies lm ON l.id = lm.list_id
             WHERE l.user_id = $1
             GROUP BY l.id`,
            [userId]
        );
        return result.rows;
    }

    // Agregar película a una lista (con título)
    static async addMovieToList(userId, listName, movieId, movieTitle) {
        const listResult = await db.query(
            'SELECT id FROM lists WHERE user_id = $1 AND name = $2',
            [userId, listName]
        );
        if (listResult.rows.length === 0) return false;
        const listId = listResult.rows[0].id;
        await db.query(
            `INSERT INTO list_movies (list_id, movie_id, movie_title)
             VALUES ($1, $2, $3)
             ON CONFLICT (list_id, movie_id) DO NOTHING`,
            [listId, movieId, movieTitle]
        );
        return true;
    }

    // Eliminar película de una lista
    static async removeMovieFromList(userId, listName, movieId) {
        const listResult = await db.query(
            'SELECT id FROM lists WHERE user_id = $1 AND name = $2',
            [userId, listName]
        );
        if (listResult.rows.length === 0) return false;
        const listId = listResult.rows[0].id;
        await db.query(
            'DELETE FROM list_movies WHERE list_id = $1 AND movie_id = $2',
            [listId, movieId]
        );
        return true;
    }

    // Verificar si una película está en una lista
    static async isMovieInList(userId, listName, movieId) {
        const result = await db.query(
            `SELECT 1 FROM list_movies lm
             JOIN lists l ON lm.list_id = l.id
             WHERE l.user_id = $1 AND l.name = $2 AND lm.movie_id = $3`,
            [userId, listName, movieId]
        );
        return result.rows.length > 0;
    }
}

module.exports = List;