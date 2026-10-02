import passport from "../config/passport.config.js";

export const passportMiddleware = (strategy, message) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        if (info?.code === "EMAIL_EXISTS") {
          return res.status(409).json({
            status: "error",
            message: info.message,
          });
        }

        if (
          info?.code === "INVALID_EMAIL" ||
          info?.code === "INVALID_PASSWORD"
        ) {
          return res.status(400).json({
            status: "error",
            message: info.message,
          });
        }

        return res.status(401).json({
          status: "error",
          message: info?.message || message,
        });
      }

      req.user = user;

      next();
    })(req, res, next);
  };
};
