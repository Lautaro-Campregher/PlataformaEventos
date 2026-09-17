import ticketsDao from "../dao/tickets.dao.js";
import eventsDao from "../dao/events.dao.js";
import usersDao from "../dao/users.dao.js";
import mailService from "./mail.service.js";

class TicketService {
  async createTicket(eventId, userId, quantity) {
    const event = await eventsDao.getEventById(eventId);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.code = "EVENT_NOT_FOUND";
      throw error;
    }

    if (event.status !== "published") {
      const error = new Error(
        "Solo se puede realizar una inscripción a eventos publicados",
      );
      error.code = "EVENT_NOT_PUBLISHED";
      throw error;
    }

    if (new Date(event.date) < new Date()) {
      const error = new Error(
        "No se puede realizar una inscripción a un evento finalizado",
      );
      error.code = "EVENT_FINISHED";
      throw error;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      const error = new Error(
        "La cantidad debe ser un número entero mayor a 0",
      );
      error.code = "INVALID_QUANTITY";
      throw error;
    }

    const existingTicket = await ticketsDao.getActiveTicketByUserAndEvent(
      userId,
      eventId,
    );

    if (existingTicket) {
      const error = new Error(
        "El usuario ya tiene una inscripción activa para este evento",
      );
      error.code = "DUPLICATE_TICKET";
      throw error;
    }

    const tickets = await ticketsDao.getTicketsByEvent(eventId);

    const occupiedSeats = tickets
      .filter((ticket) => ticket.status !== "cancelled")
      .reduce((total, ticket) => total + ticket.quantity, 0);

    const availableSeats = event.capacity - occupiedSeats;

    if (availableSeats < quantity) {
      const error = new Error(
        `No hay cupos suficientes. Cupos disponibles: ${availableSeats}`,
      );
      error.code = "INSUFFICIENT_CAPACITY";
      throw error;
    }

    const reservationCode = `RES-${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}`;

    const ticket = await ticketsDao.createTicket({
      user: userId,
      event: eventId,
      status: "confirmed",
      quantity,
      reservationCode,
    });

    const user = await usersDao.getById(userId);

    await mailService.sendTicketConfirmation({
      email: user.email,
      event,
      ticket,
    });

    return ticket;
  }

  async getMyTickets(userId) {
    return await ticketsDao.getTicketsByUser(userId);
  }

  async getTicketsByEvent(eventId) {
    const event = await eventsDao.getEventById(eventId);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.code = "EVENT_NOT_FOUND";
      throw error;
    }

    return await ticketsDao.getTicketsByEvent(eventId);
  }

  async cancelTicket(ticketId, userId, role) {
    const ticket = await ticketsDao.getTicketById(ticketId);

    if (!ticket) {
      const error = new Error("Ticket no encontrado");
      error.code = "TICKET_NOT_FOUND";
      throw error;
    }

    const isAdmin = role === "admin";
    const isOwner = ticket.user.toString() === userId;

    if (!isAdmin && !isOwner) {
      const error = new Error("No tenés permisos para cancelar este ticket");
      error.code = "TICKET_FORBIDDEN";
      throw error;
    }

    if (ticket.status === "cancelled") {
      const error = new Error("El ticket ya está cancelado");
      error.code = "TICKET_ALREADY_CANCELLED";
      throw error;
    }

    const updatedTicket = await ticketsDao.updateTicket(ticketId, {
      status: "cancelled",
      cancelledAt: new Date(),
    });

    return updatedTicket;
  }
}

export default new TicketService();
