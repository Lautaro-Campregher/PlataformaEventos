import eventDAO from "../dao/events.dao.js";

class EventRepository {
  async createEvent(eventData) {
    return await eventDAO.create(eventData);
  }

  async findEventById(id) {
    return await eventDAO.findById(id);
  }

  async findEvents(filters, pagination) {
    return await eventDAO.findAll(filters, pagination);
  }

  async updateEvent(id, eventData) {
    return await eventDAO.updateById(id, eventData);
  }

  async reserveSeats(eventId, seats) {
    return await eventDAO.reserveSeats(eventId, seats);
  }

  async releaseSeats(eventId, seats) {
    return await eventDAO.releaseSeats(eventId, seats);
  }
}

export default new EventRepository();
