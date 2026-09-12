export const errorMiddleware = (error, req, res, next) => {
  if (error.code === "EVENT_NOT_FOUND") {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  if (
    error.code === "INVALID_EVENT_DATE" ||
    error.code === "INVALID_EVENT_CAPACITY" ||
    error.code === "INVALID_PRICE" ||
    error.code === "INVALID_EVENT_STATUS" ||
    error.code === "EVENT_STATUS_LOCKED" ||
    error.code === "INVALID_PAGE" ||
    error.code === "INVALID_LIMIT"
  ) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
