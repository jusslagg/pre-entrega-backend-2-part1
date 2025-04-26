import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import userService from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const JWT_PRIVATE_KEY = "ClaveUltraSecreta";
console.log("JWT_PRIVATE_KEY:", JWT_PRIVATE_KEY);

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                let user = await userService.findOne({ email: email });
                if (user) {
                    console.log('User already exists');
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                };

                const userCreated = await userService.create(newUser);
                return done(null, userCreated);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userService.findOne({ email });
                if (!user) {
                    console.log('Usuario no encontrado');
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            const user = await userService.findById(jwt_payload.id);

            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            return done(null, user);
        } catch (error) {
            console.error(error);
            return done(error, false);
        }
    }));
};

export default initializePassport;
