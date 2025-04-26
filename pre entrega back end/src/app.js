import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import viewsRouter from './routes/views.router.js';
import sessionRouter from './routes/session.router.js';
import initializePassport from './config/passport.config.js'; // Asegúrate de que 'passport.config.js' esté correctamente configurado
dotenv.config();
const app = express();
initializePassport();

// Configuración de middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter);

app.listen(8080, () => console.log('Listening on port 8080'));
