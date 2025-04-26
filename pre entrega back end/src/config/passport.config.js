import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userService from '../models/user.model.js';  // Asegúrate de que esta ruta sea correcta
//import { JWT_PRIVATE_KEY } from '../config/config.js';  // O lo que sea la clave privada de tu JWT
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const initializePassport = () => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header Authorization
        secretOrKey: JWT_PRIVATE_KEY,  // Usa tu clave privada de JWT
    };

    passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await userService.findById(jwt_payload.id);  // Busca el usuario en la base de datos por ID
            if (user) {
                return done(null, user);  // El usuario se encuentra, lo devolvemos
            } else {
                return done(null, false);  // El usuario no existe
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.use('local', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const user = await userService.findOne({ email });
                if (!user) {
                    console.log('Usuario no encontrado');
                    return done(null, false, { message: "Usuario no encontrado" });
                }

                const isValid = bcrypt.compareSync(password, user.password);
                if (!isValid) {
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
    
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                console.error(error);
                return done(error, false);
            }
        }));
    };
    
    export default initializePassport;
