import { Router } from "express";
import { validateInput } from "../middlewares/validateInput.js";
import {
  registerUserInputDTO,
  loginUserInputDTO,
} from "../dto/user.input.dto.js";
import { passportMiddleware } from "../middlewares/passportMiddleware.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post(
  "/register",
  validateInput(registerUserInputDTO),
  passportMiddleware("register", "Credenciales inválidas"),
  register,
);

router.post(
  "/login",
  validateInput(loginUserInputDTO),
  passportMiddleware("login", "Credenciales inválidas"),
  login,
);

router.post("/logout", logout);

router.get(
  "/current",
  passportMiddleware("current", "Token inválido o manipulado"),
  getCurrentUser,
);

export default router;
