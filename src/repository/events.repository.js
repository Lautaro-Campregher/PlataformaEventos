import Event from "../models/event.model.js";

class EventRepository {
  async create(eventData) {
    return await Event.create(eventData);
  }

  async findById(id) {
    return await Event.findById(id);
  }

  async findAll() {
    return await Event.find();
  }

  async updateById(id, eventData) {
    return await Event.findByIdAndUpdate(id, eventData, {
      new: true,
      runValidators: true,
    });
  }
}

export default new EventRepository();
