import ticketsService from "../services/tickets.service.js";

export const createTicketController = async (req, res, next) => {
  try {
    const { eid } = req.params;
    const { quantity } = req.body;

    const ticket = await ticketsService.createTicket(
      eid,
      req.user.id,
      quantity,
    );

    return res.status(201).json({
      status: "success",
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTicketsController = async (req, res, next) => {
  try {
    const tickets = await ticketsService.getMyTickets(req.user.id);

    return res.status(200).json({
      status: "success",
      payload: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventTicketsController = async (req, res, next) => {
  try {
    const { eid } = req.params;

    const tickets = await ticketsService.getTicketsByEvent(eid);

    return res.status(200).json({
      status: "success",
      payload: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelTicketController = async (req, res, next) => {
  try {
    const { tid } = req.params;

    const ticket = await ticketsService.cancelTicket(
      tid,
      req.user.id,
      req.user.role,
    );

    return res.status(200).json({
      status: "success",
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};
