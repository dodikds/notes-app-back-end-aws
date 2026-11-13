import { Pool } from 'pg';

// ✅ TAMBAHKAN KEYWORD 'export' DI DEPAN CLASS
export class AuthenticationRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);
    
    // Kembalikan true jika token ditemukan, false jika tidak
    return result.rows.length > 0; 
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}