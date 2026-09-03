import eventsDao from "../dao/events.dao";

class EventService {
  async createEvent({ name, date, capacity }, organizerId) {
    const newEvent = await eventsDao.createEvent({
      name,
      date,
      capacity,
      organizer: organizerId,
    });

    return newEvent;
  }

  async getEvents() {
    return await eventsDao.getEvents();
  }

  async getEventById(id) {
    const event = await eventsDao.getEventById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.code = "EVENT_NOT_FOUND";
      throw error;
    }

    return event;
  }
}

export default new EventService();
