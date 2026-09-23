import userDAO from "../dao/users.dao.js";

class UserRepository {
  async findUserById(id) {
    return await userDAO.findById(id);
  }

  async findUserByEmail(email) {
    return await userDAO.findByEmail(email);
  }

  async createUser(userData) {
    return await userDAO.create(userData);
  }
}

export default new UserRepository();
