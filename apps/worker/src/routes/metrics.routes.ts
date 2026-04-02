import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller';

const metricsRouter: Router = Router();

metricsRouter.get("/metrics", MetricsController.getMetrics);

export default metricsRouter;