const db = require('../config/database');

class List {
  static async ensureDefaultLists(userId) {
    const lists = ['favoritas', 'pendientes', 'vistas'];
    for (const name of lists) {
      await db.query(
        'INSERT INTO lists (user_id, name) VALUES ($1, $2) ON CONFLICT (user_id, name) DO NOTHING',
        [userId, name]
      );
    }
  }

  static async addMovieToList(userId, listName, movieId) {
    // Obtener el id de la lista
    const listResult = await db.query('SELECT id FROM lists WHERE user_id = $1 AND name = $2', [userId, listName]);
    if (listResult.rows.length === 0) return false;
    const listId = listResult.rows[0].id;
    await db.query(
      'INSERT INTO list_movies (list_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [listId, movieId]
    );
    return true;
  }

  static async removeMovieFromList(userId, listName, movieId) {
    const listResult = await db.query('SELECT id FROM lists WHERE user_id = $1 AND name = $2', [userId, listName]);
    if (listResult.rows.length === 0) return false;
    const listId = listResult.rows[0].id;
    await db.query('DELETE FROM list_movies WHERE list_id = $1 AND movie_id = $2', [listId, movieId]);
    return true;
  }

  static async getUserLists(userId) {
    const lists = ['favoritas', 'pendientes', 'vistas'];
    const result = {};
    for (const name of lists) {
      const listRes = await db.query(
        `SELECT l.id, json_agg(lm.movie_id) as movies
         FROM lists l
         LEFT JOIN list_movies lm ON l.id = lm.list_id
         WHERE l.user_id = $1 AND l.name = $2
         GROUP BY l.id`,
        [userId, name]
      );
      result[name] = listRes.rows[0]?.movies || [];
    }
    return result;
  }
}

module.exports = List;