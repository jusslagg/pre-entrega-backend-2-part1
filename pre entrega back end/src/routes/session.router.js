import { Router } from 'express';
import passport from 'passport';
import { generateToken } from '../utils.js';
import UserModel from '../models/user.model.js';

const router = Router();

// Ruta para el registro de usuarios
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send({ status: 'error', error: 'Missing required fields' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: 'error', error: 'Invalid email format' });
        }

        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(400).send({ status: 'error', error: 'User already exists' });
        }

        let user;
        try {
            user = await UserModel.create({
                first_name,
                last_name,
                email,
                age,
                password
            });
        } catch (dbError) {
            console.error("Database error creating user:", dbError);
            return res.status(500).send({ status: 'error', error: 'Database error creating user' });
        }

        const access_token = generateToken(user);
        res.cookie('jwt', access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        });
        res.send({ status: 'success', access_token });

    } catch (error) {
        console.error("General error registering user:", error);
        return res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
});

// Ruta para obtener el usuario actual con JWT
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({ status: 'success', user: req.user });
});

// Ruta para el login de usuarios
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email, password });
        if (!user) {
            return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
        }

        const access_token = generateToken(user);
        res.cookie('jwt', access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        });
        res.send({ status: 'success', access_token });

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
});

export default router;
