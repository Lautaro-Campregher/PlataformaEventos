import { Router } from "express";
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
  passportMiddleware("register", "Credenciales inválidas"),
  register,
);

router.post(
  "/login",
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
