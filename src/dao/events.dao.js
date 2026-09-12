import eventRepository from "../repository/events.repository.js";

class EventDAO {
  async createEvent(eventData) {
    return await eventRepository.create(eventData);
  }

  async getEventById(id) {
    return await eventRepository.findById(id);
  }

  async getEvents(filters, pagination) {
    return eventRepository.findAll(filters, pagination);
  }

  async updateEvent(id, eventData) {
    return await eventRepository.updateById(id, eventData);
  }
}

export default new EventDAO();
