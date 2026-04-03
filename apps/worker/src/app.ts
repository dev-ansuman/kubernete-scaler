import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import metricsRoutes from './routes/metrics.routes';

const app: Application = express();

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests! Please try again after some time',
    standardHeaders: true,
    legacyHeaders: false
})

app.use(limiter);

app.use(express.json(), morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        service: 'worker-service',
        currentTime: `${new Date().toISOString()}`,
    });
});

app.use('/', metricsRoutes);

export default app;