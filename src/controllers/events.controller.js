import eventsService from "../services/events.service.js";

export const createEventController = async (req, res, next) => {
  try {
    const { title, description, category, date, location, capacity, price } =
      req.body;

    const owner = req.user.id;

    const newEvent = await eventsService.createEvent(
      {
        title,
        description,
        category,
        date,
        location,
        capacity,
        price,
      },
      owner,
    );

    return res.status(201).json({
      status: "success",
      payload: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventsController = async (req, res, next) => {
  try {
    const { status, category, location, dateFrom, dateTo, page, limit, sort } =
      req.query;

    const events = await eventsService.getEvents({
      status,
      category,
      location,
      dateFrom,
      dateTo,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sort,
    });

    return res.status(200).json({
      status: "success",
      payload: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventByIdController = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await eventsService.getEventById(eventId);

    res.status(200).json({
      status: "success",
      payload: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventController = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await eventsService.updateEvent(eventId, req.body);

    return res.status(200).json({
      status: "success",
      payload: event,
    });
  } catch (error) {
    next(error);
  }
};

export const changeEventStatusController = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;

    const event = await eventsService.changeEventStatus(eventId, status);

    return res.status(200).json({
      status: "success",
      payload: event,
    });
  } catch (error) {
    next(error);
  }
};
