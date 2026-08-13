import sessionsService from "../services/sessions.service.js";
import { generateJWT } from "../utils/jwt.js";
export const register = async (req, res) => {
  try {
    const result = await sessionsService.register(req.body);

    return res.status(201).json({
      status: "success",
      payload: result,
    });
  } catch (error) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        status: "error",

        message: "El email ya está registrado",
      });
    }

    return res.status(400).json({
      status: "error",

      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const tokenUser = await sessionsService.login(req.body);
    const token = generateJWT(tokenUser);

    res.cookie("currentUser", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      status: "success",
      message: "Login Correcto",
    });
  } catch (error) {
    if (error.message === "Credenciales inválidas") {
      return res.status(401).json({
        status: "error",
        message: "Credenciales inválidas",
      });
    }
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    status: "success",
    payload: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

export const logout = async (req, res) => {
  res.clearCookie("currentUser");

  return res.status(200).json({
    status: "success",
    message: "Sesion finalizada",
  });
};
