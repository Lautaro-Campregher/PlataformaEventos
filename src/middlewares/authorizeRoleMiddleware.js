export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "No tenés permisos para realizar esta acción",
      });
    }
    next();
  };
};
