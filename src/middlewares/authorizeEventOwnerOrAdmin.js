import eventRepository from "../repository/events.repository.js";

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await eventRepository.findById(eventId);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "no se encontró el evento",
      });
    }

    const role = req.user.role;
    const isAdmin = role === "admin";
    const isOwner = event.organizer.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para realizar esta acción",
      });
    }

    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};
