import userRepository from "../repository/user.repository.js";

import { createHash, validatePassword } from "../utils/hash.js";

class SessionsService {
  async register(data) {
    const { first_name, last_name, email, password } = data;

    if (!first_name || !last_name || !email || !password) {
      throw new Error("Faltan campos obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Email inválido");
    }

    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const existingUser = await userRepository.getByEmail(normalizedEmail);

    if (existingUser) {
      throw new Error("Email ya está registrado");
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
      email: normalizedEmail,
      role: user.role,
    };
  }

  async login(data) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Credenciales inválidas");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.getByEmail(normalizedEmail);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const validPassword = await validatePassword(password, user.password);

    if (!validPassword) {
      throw new Error("Credenciales inválidas");
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }
}

export default new SessionsService();
