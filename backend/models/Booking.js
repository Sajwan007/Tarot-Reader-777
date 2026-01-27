const db = require('../config/database');

class Booking {
  static async create(bookingData) {
    const query = `
      INSERT INTO bookings (client_id, service_type, date, time, status, notes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    const values = [
      bookingData.client_id,
      bookingData.service_type,
      bookingData.date,
      bookingData.time,
      bookingData.status || 'pending',
      bookingData.notes
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM bookings WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByClientId(clientId) {
    const query = 'SELECT * FROM bookings WHERE client_id = $1 ORDER BY date DESC';
    const result = await db.query(query, [clientId]);
    return result.rows;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT b.*, c.name as client_name, c.email as client_email 
      FROM bookings b 
      JOIN clients c ON b.client_id = c.id
    `;
    const values = [];
    const conditions = [];

    if (filters.status) {
      conditions.push(`b.status = $${values.length + 1}`);
      values.push(filters.status);
    }

    if (filters.date_from) {
      conditions.push(`b.date >= $${values.length + 1}`);
      values.push(filters.date_from);
    }

    if (filters.date_to) {
      conditions.push(`b.date <= $${values.length + 1}`);
      values.push(filters.date_to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY b.date DESC';

    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = [];
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE bookings 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    values.unshift(id);
    fields.forEach(field => values.push(updateData[field]));
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM bookings WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Booking;
