import userRepository from "../repository/user.repository.js";
import { createHash } from "../utils/hash.js";
import userDAO from "../dao/users.dao.js";

class UserService {
  async registerUser({ first_name, last_name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Email inválido");
    }

    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const existingUser = await userDAO.getByEmail(normalizedEmail);

    if (existingUser) {
      const error = new Error("El email ya está registrado");

      error.code = "EMAIL_EXISTS";

      throw error;
    }

    const hashedPassword = await createHash(password);

    const newUser = await userDAO.create({
      first_name,
      last_name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      provider: "local",
      providerId: null,
    });

    return {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    };
  }
}

export default new UserService();
