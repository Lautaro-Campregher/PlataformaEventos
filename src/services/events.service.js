import eventsDao from "../dao/events.dao.js";

class EventService {
  async createEvent(
    { title, description, category, date, location, capacity, price },
    organizerId,
  ) {
    if (new Date(date) < new Date()) {
      const error = new Error(
        "La fecha del evento no puede ser anterior a la fecha actual",
      );
      error.code = "INVALID_EVENT_DATE";
      throw error;
    }

    if (capacity <= 0) {
      const error = new Error("La capacidad debe ser mayor a 0");
      error.code = "INVALID_EVENT_CAPACITY";
      throw error;
    }

    if (price < 0) {
      const error = new Error("El precio no puede ser negativo");
      error.code = "INVALID_PRICE";
      throw error;
    }

    const newEvent = await eventsDao.createEvent({
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,

      organizer: organizerId,
    });

    return newEvent;
  }

  async getEvents({
    status,
    category,
    location,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10,
    sort = "date",
  }) {
    if (page < 1) {
      const error = new Error("La página debe ser mayor o igual a 1");
      error.code = "INVALID_PAGE";
      throw error;
    }

    if (limit < 1) {
      const error = new Error("El límite debe ser mayor o igual a 1");
      error.code = "INVALID_LIMIT";
      throw error;
    }
    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (category) {
      filters.category = category;
    }

    if (location) {
      filters.location = location;
    }

    if (dateFrom || dateTo) {
      filters.date = {};
    }

    if (dateFrom) {
      filters.date.$gte = new Date(dateFrom);
    }

    if (dateTo) {
      filters.date.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
    const sortDirection = sort.startsWith("-") ? -1 : 1;

    sortOptions[sortField] = sortDirection;

    const result = await eventsDao.getEvents(filters, {
      skip,
      limit,
      sort: sortOptions,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.events,
      page,
      limit,
      total: result.total,
      totalPages,
    };
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

  async updateEvent(id, eventData) {
    const event = await eventsDao.getEventById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.code = "EVENT_NOT_FOUND";
      throw error;
    }

    if (event.status === "cancelled") {
      const error = new Error("No se puede modificar un evento cancelado");
      error.code = "EVENT_STATUS_LOCKED";
      throw error;
    }

    if (eventData.date !== undefined && new Date(eventData.date) < new Date()) {
      const error = new Error(
        "La fecha del evento no puede ser anterior a la fecha actual",
      );
      error.code = "INVALID_EVENT_DATE";
      throw error;
    }

    if (eventData.capacity !== undefined && eventData.capacity <= 0) {
      const error = new Error("La capacidad debe ser mayor a 0");
      error.code = "INVALID_EVENT_CAPACITY";
      throw error;
    }

    if (eventData.price !== undefined && eventData.price < 0) {
      const error = new Error("El precio no puede ser negativo");
      error.code = "INVALID_PRICE";
      throw error;
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "date",
      "location",
      "capacity",
      "price",
    ];

    const cleanEventData = {};

    for (const field of allowedFields) {
      if (eventData[field] !== undefined) {
        cleanEventData[field] = eventData[field];
      }
    }

    const updatedEvent = await eventsDao.updateEvent(id, cleanEventData);

    return updatedEvent;
  }

  async changeEventStatus(id, status) {
    const event = await eventsDao.getEventById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.code = "EVENT_NOT_FOUND";
      throw error;
    }

    const validStatuses = ["draft", "published", "cancelled", "finished"];

    if (!validStatuses.includes(status)) {
      const error = new Error("Estado de evento inválido");
      error.code = "INVALID_EVENT_STATUS";
      throw error;
    }

    if (status === "published" && new Date(event.date) < new Date()) {
      const error = new Error(
        "No se puede publicar un evento cuya fecha ya pasó",
      );
      error.code = "INVALID_EVENT_DATE";
      throw error;
    }

    if (event.status === "cancelled" || event.status === "finished") {
      const error = new Error(
        "No se puede modificar el estado de un evento cancelado o finalizado",
      );
      error.code = "EVENT_STATUS_LOCKED";
      throw error;
    }

    const updatedEvent = await eventsDao.updateEvent(id, {
      status,
    });

    return updatedEvent;
  }
}

export default new EventService();
