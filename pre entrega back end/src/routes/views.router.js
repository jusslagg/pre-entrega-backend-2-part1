import { Router } from 'express';
import { __dirname, authToken } from '../utils.js';
import path from 'path';

const router = Router();

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vista_registro.html'));
});

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vista_login.html'));
});

// Ruta de inicio donde muestra el mensaje de bienvenida si hay usuario
router.get('/', authToken, (req, res) => {
    if (req.user) {
        res.send(`<h1>Bienvenido, ${req.user.name}!</h1>`);
    } else {
        res.redirect('/login');
    }
});

// Ruta para obtener el usuario actual
router.get('/current', authToken, (req, res) => {
    res.send({ status: 'success', payload: req.user });
});

export default router;
