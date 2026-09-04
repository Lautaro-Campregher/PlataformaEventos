import eventsService from "../services/events.service.js";

export const createEventController = async (req, res, next) => {
  try {
    const { name, date, capacity } = req.body;

    const owner = req.user.id;

    const newEvent = await eventsService.createEvent(
      {
        name,
        date,
        capacity,
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
    const events = await eventsService.getEvents();

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
