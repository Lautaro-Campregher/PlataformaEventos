import userRepository from "../repository/user.repository.js";

class UsersDAO {
  async getByEmail(email) {
    return await userRepository.getByEmail(email);
  }

  async getById(id) {
    return await userRepository.getById(id);
  }

  async create(userData) {
    return await userRepository.create(userData);
  }
}

export default new UsersDAO();
