import ticketsRepository from "../repository/tickets.repository.js";

class TicketDAO {
  async createTicket(ticketData) {
    return await ticketsRepository.create(ticketData);
  }

  async getTicketById(id) {
    return await ticketsRepository.findById(id);
  }

  async getTicketsByUser(userId) {
    return await ticketsRepository.findByUser(userId);
  }

  async getTicketsByEvent(eventId) {
    return await ticketsRepository.findByEvent(eventId);
  }

  async getActiveTicketByUserAndEvent(userId, eventId) {
    return await ticketsRepository.findActiveByUserAndEvent(userId, eventId);
  }

  async updateTicket(id, ticketData) {
    return await ticketsRepository.updateById(id, ticketData);
  }
}

export default new TicketDAO();
