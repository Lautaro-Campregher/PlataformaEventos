import Ticket from "../models/Ticket.js";

class TicketRepository {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async findById(id) {
    return await Ticket.findById(id);
  }

  async findByUser(userId) {
    return await Ticket.find({ user: userId }).populate(
      "event",
      "title date location",
    );
  }

  async findByEvent(eventId) {
    return await Ticket.find({ event: eventId });
  }

  async findActiveByUserAndEvent(userId, eventId) {
    return await Ticket.findOne({
      user: userId,
      event: eventId,
      status: { $ne: "cancelled" },
    });
  }

  async updateById(id, ticketData) {
    return await Ticket.findByIdAndUpdate(id, ticketData, {
      new: true,
      runValidators: true,
    });
  }
}

export default new TicketRepository();
