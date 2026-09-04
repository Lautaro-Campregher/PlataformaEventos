import { Router } from "express";

import { authMiddleware } from "../middlewares/authenticationMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoleMiddleware.js";

import { getUsersController } from "../controllers/admin.controller.js";

const router = Router();

router.get(
  "/users",
  authMiddleware,
  authorizeRoles(["admin"]),
  getUsersController,
);

export default router;
