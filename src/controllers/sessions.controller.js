import { generateJWT } from "../utils/jwt.js";
import UserDTO from "../dto/user.dto.js";

export const register = async (req, res) => {
  return res.status(201).json({
    status: "success",
    payload: req.user,
  });
};

export const login = async (req, res) => {
  try {
    const user = req.user;

    const token = generateJWT({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

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
  const userDTO = new UserDTO(req.user);

  return res.status(200).json({
    status: "success",
    payload: userDTO,
  });
};

export const logout = async (req, res) => {
  res.clearCookie("currentUser");

  return res.status(200).json({
    status: "success",
    message: "Sesion finalizada",
  });
};
