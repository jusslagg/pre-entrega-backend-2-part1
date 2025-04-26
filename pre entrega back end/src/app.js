import dotenv from 'dotenv';
dotenv.config({ path: 'pre entrega back end/.env' });
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import viewsRouter from './routes/views.router.js';
import sessionRouter from './routes/session.router.js';
import initializePassport from './config/passport.config.js';

const app = express();
initializePassport();

// Database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middlewares configuration
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter);

app.listen(8080, () => console.log('Listening on port 8080'));
