import { Router } from 'express';
import passport from 'passport';
import { generateToken } from '../utils.js'; // Asegúrate de que esta función exista

const router = Router();
const users = []; // Persistimos usuarios en memoria

// Ruta para el registro de usuarios
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const exists = users.find(user => user.email === email);
    if (exists) 
        return res.status(406).send({ status: 'error', error: 'User already exists' });

    const user = { name, email, password };
    users.push(user);

    // Generamos un token con el usuario y se lo enviamos al usuario
    const access_token = generateToken(user);
    res.cookie('jwt', access_token, { httpOnly: true }); // Establecer la cookie
    res.send({ status: 'success', access_token });
});

// Ruta para obtener el usuario actual con JWT
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({ status: 'success', user: req.user });
});

// Ruta para el login de usuarios
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) return res.status(408).send({ status: 'error', error: 'Invalid credentials' });
    
    // Generamos un token con el usuario y se lo enviamos
    const access_token = generateToken(user);
    res.send({ status: 'success', access_token });
});

export default router;
