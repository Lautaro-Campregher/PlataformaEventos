export const getUsersController = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: "success",
      message: "Solo un admin puede ver la lista completa de usuarios",
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};
