export const getSessions = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Modulo de sesiones listo",
  });
};
