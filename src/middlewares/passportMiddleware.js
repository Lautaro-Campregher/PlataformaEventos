import passport from "../config/passport.config.js";

export const passportMiddleware = (strategy, message) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          status: "error",
          message,
        });
      }

      req.user = user;

      next();
    })(req, res, next);
  };
};
