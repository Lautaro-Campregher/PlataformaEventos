import Event from "../models/Event.js";

class EventRepository {
  async create(eventData) {
    return await Event.create(eventData);
  }

  async findById(id) {
    return await Event.findById(id);
  }

  async findAll(filters, { skip, limit, sort }) {
    const [events, total] = await Promise.all([
      Event.find(filters).sort(sort).skip(skip).limit(limit),

      Event.countDocuments(filters),
    ]);

    return {
      events,
      total,
    };
  }

  async updateById(id, eventData) {
    return await Event.findByIdAndUpdate(id, eventData, {
      new: true,
      runValidators: true,
    });
  }
}

export default new EventRepository();
