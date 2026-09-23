import ticketDAO from "../dao/tickets.dao.js";

class TicketRepository {
  async createTicket(ticketData) {
    return await ticketDAO.create(ticketData);
  }

  async findTicketById(id) {
    return await ticketDAO.findById(id);
  }

  async findMyTickets(userId) {
    return await ticketDAO.findByUser(userId);
  }

  async findTicketsByEvent(eventId) {
    return await ticketDAO.findByEvent(eventId);
  }

  async findActiveTicket(userId, eventId) {
    return await ticketDAO.findActiveByUserAndEvent(userId, eventId);
  }

  async updateTicket(id, ticketData) {
    return await ticketDAO.updateById(id, ticketData);
  }
}

export default new TicketRepository();
