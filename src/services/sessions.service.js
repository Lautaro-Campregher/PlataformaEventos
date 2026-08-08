import userRepository from "../repository/user.repository.js";

import { createHash } from "../utils/hash.js";

class SessionsService {
  async register(data) {
    const { first_name, last_name, email, password } = data;

    if (!first_name || !last_name || !email || !password) {
      throw new Error("Faltan campos obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Email invalido");
    }

    if (password.length < 8) {
      throw new Error("Password invalida");
    }

    const existingUser = await userRepository.getByEmail(normalizedEmail);

    if (existingUser) {
      throw new Error("Email ya registrado");
    }

    const hashedPassword = await createHash(password);

    const user = await userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
  }
}

export default new SessionsService();
