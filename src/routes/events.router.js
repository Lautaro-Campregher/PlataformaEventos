import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoleMiddleware.js";
import { authorizeEventOwnerOrAdmin } from "../middlewares/authorizeEventOwnerOrAdmin.js";
import { authMiddleware } from "../middlewares/authenticationMiddleware.js";
import {
  createEventController,
  getEventsController,
  getEventByIdController,
  updateEventController,
} from "../controllers/events.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles(["organizer", "admin"]),
  createEventController,
);

router.get("/", getEventsController);

router.get("/:eventId", authMiddleware, getEventByIdController);

router.put(
  "/:eventId",
  authMiddleware,
  authorizeRoles(["organizer", "admin"]),
  authorizeEventOwnerOrAdmin,
  updateEventController,
);

export default router;
