// 1. Gunakan Named Import karena repository menggunakan 'export class'
import { UserRepositories } from '../repositories/user-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

// 2. Hapus baris ini! (Kode executable tidak boleh ada di level top-level module)
// const id = await UserRepositories.createUser(data); 

// 3. Inisialisasi instance repository DI SINI
const userRepositories = new UserRepositories();

export const createUser = async (req, res, next) => {
  const { username, password, fullname } = req.validated;

  const isUsernameExist = await userRepositories.verifyNewUsername(username);
  if (isUsernameExist) {
    return next(new InvariantError('Gagal menambahkan user. Username sudah digunakan.'));
  }

  const user = await userRepositories.createUser({
    username,
    password,
    fullname,
  });

  // Note: Repository biasanya mengembalikan ID string, bukan object user penuh
  // Sesuaikan validasi ini dengan return value repository Anda
  if (!user) {
    return next(new InvariantError('User gagal ditambahkan'));
  }

  return response(res, 201, 'User berhasil ditambahkan', { userId: user });
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await userRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil ditampilkan', user);
};