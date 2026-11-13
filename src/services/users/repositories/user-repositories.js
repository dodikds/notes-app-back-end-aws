import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

export class UserRepositories {
  constructor() {
    // ✅ PERBAIKAN: Ubah this.pool menjadi this._pool
    this._pool = new Pool(); 
  }

  async createUser({ username, password, fullname }) {
    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, username, hashedPassword, fullname, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id; // ✅ Kembalikan ID saja, bukan object row penuh
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyUserCredential(username, password) {    
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    
    const result = await this._pool.query(query); // ✅ Gunakan this._pool
    
    if (result.rows.length === 0) { // ✅ Cek length rows, bukan user langsung
      return null;
    }
    
    const { id, password: hashedPassword } = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    
    if (!isPasswordMatch) {
      return null;
    }
    
    return id;
  }
}