const db = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(userData) {
    const { name, email, password } = userData;
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, password]
    );
    return result.rows[0].id;
  }

  static async findById(id) {
    const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = User;