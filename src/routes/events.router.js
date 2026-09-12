import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoleMiddleware.js";
import { authorizeEventOwnerOrAdmin } from "../middlewares/authorizeEventOwnerOrAdmin.js";
import { passportMiddleware } from "../middlewares/passportMiddleware.js";
import {
  createEventController,
  getEventsController,
  getEventByIdController,
  updateEventController,
  changeEventStatusController,
} from "../controllers/events.controller.js";

const router = Router();

router.post(
  "/",
  passportMiddleware("current", "No autenticado"),
  authorizeRoles(["organizer", "admin"]),
  createEventController,
);

router.get("/", getEventsController);

router.get("/:eventId", getEventByIdController);

router.put(
  "/:eventId",
  passportMiddleware("current", "No autenticado"),
  authorizeRoles(["organizer", "admin"]),
  authorizeEventOwnerOrAdmin,
  updateEventController,
);

router.patch(
  "/:eventId/status",
  passportMiddleware("current", "No autenticado"),
  authorizeRoles(["organizer", "admin"]),
  authorizeEventOwnerOrAdmin,
  changeEventStatusController,
);

export default router;
