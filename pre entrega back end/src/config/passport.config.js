import passport from "passport";
import local from "passport-local";
import userModel from "../models/user.model.js";
import {
  createHash,
  generateToken,
  isValidPassword,
  PRIVATE_KEY,
} from "../utils.js";

import jwt from "passport-jwt";

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies["tokenCookie"];
  return token;
};

const initializePassport = () => {
  //Estrategia de autenticación (función 'current')
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          done(error);
        }
      }
    )
  );


  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { first_name, last_name, repeat_password, age, cart, role } =
          req.body;
        try {
          let user = await userModel.findOne({ email });
          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          if (password !== repeat_password) {
            console.log("Las contraseñas no coinciden");
            return done(null, false);
          }

          let newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart,
            role,
          });
          await newUser.save();

          const accessToken = generateToken(newUser.toObject());
          console.log(accessToken);

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estategia de login
  passport.use(
    "login",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          if (!email || !password)
            return done(null, false, {
              message: "Todos los campos son obligatorios",
            });

          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
