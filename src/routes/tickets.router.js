import { Router } from "express";
import { validateInput } from "../middlewares/validateInput.js";
import { createTicketInputDTO } from "../dto/tickets.input.dto.js";
import { passportMiddleware } from "../middlewares/passportMiddleware.js";
import { authorizeEventTickets } from "../middlewares/authorizeEventTickets.js";
import {
  createTicketController,
  getMyTicketsController,
  getEventTicketsController,
  cancelTicketController,
} from "../controllers/tickets.controller.js";

const router = Router();

router.post(
  "/events/:eid/tickets",
  passportMiddleware("current", "No autenticado"),
  validateInput(createTicketInputDTO),
  createTicketController,
);

router.get(
  "/tickets/my-tickets",
  passportMiddleware("current", "No autenticado"),
  getMyTicketsController,
);

router.get(
  "/events/:eid/tickets",
  passportMiddleware("current", "No autenticado"),
  authorizeEventTickets,
  getEventTicketsController,
);

router.patch(
  "/tickets/:tid/cancel",
  passportMiddleware("current", "No autenticado"),
  cancelTicketController,
);

export default router;
