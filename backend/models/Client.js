const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Client {
  static async create(clientData) {
    const hashedPassword = clientData.password ? await bcrypt.hash(clientData.password, 10) : null;
    
    const query = `
      INSERT INTO clients (name, email, phone, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, name, email, phone, created_at
    `;
    const values = [
      clientData.name,
      clientData.email,
      clientData.phone,
      hashedPassword
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, phone, created_at FROM clients WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM clients WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, name, email, phone, created_at FROM clients ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = [];
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE clients 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, phone, created_at
    `;
    
    values.unshift(id);
    fields.forEach(field => values.push(updateData[field]));
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM clients WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Client;
