import eventRepository from "../repositories/event.repository.js";

class EventDAO {
  async createEvent(eventData) {
    return await eventRepository.create(eventData);
  }

  async getEventById(id) {
    return await eventRepository.findById(id);
  }

  async getEvents() {
    return await eventRepository.findAll();
  }

  async updateEvent(id, eventData) {
    return await eventRepository.updateById(id, eventData);
  }
}

export default new EventDAO();
