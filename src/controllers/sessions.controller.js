import sessionsService from "../services/sessions.service.js";

export const register = async (req, res) => {
  try {
    const result = await sessionsService.register(req.body);

    return res.status(201).json({
      status: "success",
      payload: result,
    });
  } catch (error) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        status: "error",

        message: "El email ya esta registrado",
      });
    }

    return res.status(400).json({
      status: "error",

      message: error.message,
    });
  }
};
