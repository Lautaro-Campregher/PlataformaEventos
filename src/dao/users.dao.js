import User from "../models/User.js";

class UsersDAO {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(user) {
    return await User.create(user);
  }
}

export default new UsersDAO();
