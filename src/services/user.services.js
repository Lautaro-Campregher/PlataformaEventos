import { createHash } from "../utils/hash.js";
import userRepository from "../repository/user.repository.js";

class UserService {
  async registerUser({ first_name, last_name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      const error = new Error("Email inválido");
      error.code = "INVALID_EMAIL";
      throw error;
    }

    if (password.length < 8) {
      const error = new Error("La contraseña debe tener al menos 8 caracteres");
      error.code = "INVALID_PASSWORD";
      throw error;
    }

    const existingUser = await userRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
      const error = new Error("El email ya está registrado");
      error.code = "EMAIL_EXISTS";
      throw error;
    }

    const hashedPassword = await createHash(password);

    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      provider: "local",
      providerId: null,
    });

    return newUser;
  }
}

export default new UserService();
