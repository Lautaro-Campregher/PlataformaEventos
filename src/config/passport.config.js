import "dotenv/config";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userDAO from "../dao/users.dao.js";
import userServices from "../services/user.services.js";
import { validatePassword } from "../utils/hash.js";

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },

    async (req, email, password, done) => {
      try {
        const { first_name, last_name } = req.body;

        if (!first_name || !last_name || !email || !password) {
          return done(null, false, {
            message: "Todos los campos son obligatorios",
          });
        }

        const newUser = await userServices.registerUser({
          first_name,
          last_name,
          email,
          password,
        });

        return done(null, newUser);
      } catch (error) {
        if (error.code === "EMAIL_EXISTS") {
          return done(null, false, {
            message: "El email ya está registrado",
          });
        }
        return done(error);
      }
    },
  ),
);

passport.use(
  "login",

  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    async (email, password, done) => {
      try {
        const normalizedEmail = email.trim().toLocaleLowerCase();

        const user = await userDAO.getByEmail(normalizedEmail);

        if (!user) {
          return done(null, false, {
            message: "Credenciales inválidas",
          });
        }

        const validPassword = await validatePassword(password, user.password);

        if (!validPassword) {
          return done(null, false, {
            message: "Credenciales inválidas",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const cookieExtractor = (req) => {
  if (req && req.cookies && req.cookies.currentUser) {
    return req.cookies.currentUser;
  }

  return null;
};

passport.use(
  "current",

  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),

      secretOrKey: process.env.JWT_SECRET,
    },

    async (payload, done) => {
      try {
        const user = await userDAO.getById(payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
