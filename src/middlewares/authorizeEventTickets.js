import Event from "../models/Event.js";

export const authorizeEventTickets = async (req, res, next) => {
  try {
    const { eid } = req.params;

    const event = await Event.findById(eid);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Evento no encontrado",
      });
    }

    if (req.user.role === "admin") {
      req.event = event;
      return next();
    }

    if (
      req.user.role === "organizer" &&
      event.organizer.toString() === req.user.id
    ) {
      req.event = event;
      return next();
    }

    return res.status(403).json({
      status: "error",
      message: "No tenés permisos para consultar los tickets de este evento",
    });
  } catch (error) {
    next(error);
  }
};
