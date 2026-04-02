import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';

const statsRouter: Router = Router();

statsRouter.get('/stats', StatsController.getStats);
statsRouter.get('/metrics', StatsController.getMetrics);

export default statsRouter;
