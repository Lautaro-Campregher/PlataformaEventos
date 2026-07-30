import { getAllSessions } from "../services/sessions.service.js";

export const getSessions = (req, res) => {
  const message = getAllSessions();

  res.status(200).json({
    status: "success",
    message,
  });
};
