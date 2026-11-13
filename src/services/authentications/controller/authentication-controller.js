// ✅ Gunakan Named Import { } karena repository menggunakan 'export class'
import { AuthenticationRepositories } from '../repositories/authentication-repositories.js';
import { UserRepositories } from '../../users/repositories/user-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

// ✅ Inisialisasi instance repository agar bisa memanggil method-nya
const authRepositories = new AuthenticationRepositories();
const userRepositories = new UserRepositories();

export const login = async (req, res, next) => {
  const { username, password } = req.validated;
  
  // ✅ Panggil method melalui instance (userRepositories), bukan nama Class
  const userId = await userRepositories.verifyUserCredential(username, password);
 
  if (!userId) {
    return next(new AuthenticationError('Kredensial yang Anda berikan salah'));
  }
 
  const accessToken = TokenManager.generateAccessToken({ id: userId });
  const refreshToken = TokenManager.generateRefreshToken({ id: userId });
 
  await authRepositories.addRefreshToken(refreshRefreshToken);
 
  return response(res, 201, 'Authentication berhasil ditambahkan', {
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.validated;
 
  const result = await authRepositories.verifyRefreshToken(refreshToken);
 
  if (!result) {
    return next(new InvariantError('Refresh token tidak valid'));
  }
 
  const { id } = TokenManager.verifyRefreshToken(refreshToken);
  const accessToken = TokenManager.generateAccessToken({ id });
 
  return response(res, 200, 'Access Token berhasil diperbarui', { accessToken });
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.validated;
 
  const result = await authRepositories.verifyRefreshToken(refreshToken);
 
  if (!result) {
    return next(new InvariantError('Refresh token tidak valid'));
  }
 
  await authRepositories.deleteRefreshToken(refreshToken);
 
  return response(res, 200, 'Refresh token berhasil dihapus');
};