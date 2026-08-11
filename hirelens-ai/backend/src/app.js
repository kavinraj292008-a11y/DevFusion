import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Health Route
app.use('/api', healthRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;