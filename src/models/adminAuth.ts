// models/adminAuth.ts
const db = require('../config/db');
import bcrypt from 'bcrypt';

const saltRounds = 10;

export interface AdminAuthEntity {
  admin_id: number;
  email: string;
  password: string;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

class AdminAuth {
  static async create(email: string, password: string): Promise<AdminAuthEntity> {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      `INSERT INTO admin_auth (email, password) VALUES ($1, $2) RETURNING *`,
      [email, hashedPassword]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<AdminAuthEntity | null> {
    const result = await db.query(
      `SELECT * FROM admin_auth WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<AdminAuthEntity | null> {
    const result = await db.query(
      `SELECT * FROM admin_auth WHERE admin_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async updateLastLogin(adminId: number): Promise<void> {
    await db.query(
      `UPDATE admin_auth SET last_login = CURRENT_TIMESTAMP WHERE admin_id = $1`,
      [adminId]
    );
  }
}

export default AdminAuth;
