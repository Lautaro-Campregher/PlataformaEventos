export const ticketDTO = (ticket) => {
  if (!ticket) return null;

  const result = {
    id: ticket._id,
    status: ticket.status,
    quantity: ticket.quantity,
    reservationCode: ticket.reservationCode,
    createdAt: ticket.createdAt,
    cancelledAt: ticket.cancelledAt,
  };

  if (ticket.event && typeof ticket.event === "object") {
    result.event = {
      id: ticket.event._id,
      title: ticket.event.title,
      date: ticket.event.date,
      location: ticket.event.location,
    };
  } else {
    result.event = ticket.event;
  }

  if (ticket.user && typeof ticket.user === "object") {
    result.user = {
      id: ticket.user._id,
      first_name: ticket.user.first_name,
      last_name: ticket.user.last_name,
      email: ticket.user.email,
    };
  } else {
    result.user = ticket.user;
  }

  return result;
};
