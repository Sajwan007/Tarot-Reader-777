const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
  static async create(adminData) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    const query = `
      INSERT INTO admins (username, email, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, username, email, role, created_at
    `;
    const values = [
      adminData.username,
      adminData.email,
      hashedPassword,
      adminData.role || 'admin'
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM admins WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM admins WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM admins WHERE username = $1';
    const result = await db.query(query, [username]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, username, email, role, created_at FROM admins ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = [];
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE admins 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, username, email, role, created_at
    `;
    
    values.unshift(id);
    fields.forEach(field => values.push(updateData[field]));
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM admins WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Admin;
