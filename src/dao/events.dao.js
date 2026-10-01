import Event from "../models/Event.js";

class EventDAO {
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

  async reserveSeats(eventId, seats) {
    return Event.findOneAndUpdate(
      {
        _id: eventId,
        status: "published",
        date: { $gt: new Date() },
        $expr: {
          $lte: [{ $add: ["$reserved", seats] }, "$capacity"],
        },
      },
      {
        $inc: {
          reserved: seats,
        },
      },
      {
        new: true,
      },
    );
  }

  async releaseSeats(eventId, seats) {
    return Event.findOneAndUpdate(
      {
        _id: eventId,
        reserved: {
          $gte: seats,
        },
      },
      {
        $inc: {
          reserved: -seats,
        },
      },
      {
        new: true,
      },
    );
  }
}

export default new EventDAO();
