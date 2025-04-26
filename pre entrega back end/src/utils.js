import userService from './models/user.model.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

const PRIVATE_KEY = "ClaveUltraSecreta"; // O utiliza la clave del archivo .env

// Función para generar un token JWT
export const generateToken = (user) => {
    const token = jwt.sign(user, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
};

// Middleware de autenticación para verificar el token JWT
export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("No token provided");
        return res.status(401).send({
            error: "Not authenticated"
        });
    }

    const token = authHeader.split(' ')[1]; // Token después de 'Bearer'
    if (!token) {
        console.log("Token missing after Bearer");
        return res.status(401).send({
            error: "Token missing"
        });
    }

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) {
            console.log("Token verification failed:", error);
            return res.status(403).send({
                error: "Not authorized"
            });
        }

        // Buscamos el usuario en la base de datos
        userService.findById(credentials.id)
            .then(user => {
                req.user = user; // Establecemos el usuario en la solicitud
                next();
            })
            .catch(err => {
                console.log("Error fetching user:", err);
                return res.status(500).send({
                    error: "Failed to fetch user"
                });
            });
    });
};

export const __dirname = dirname(__filename);
