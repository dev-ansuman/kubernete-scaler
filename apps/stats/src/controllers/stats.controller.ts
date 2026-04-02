import { Request, Response } from 'express';
import { StatsService } from '../services/stats.service';
import { register } from '../metrics/metrics';

export class StatsController {
    static async getStats(_req: Request, res: Response) {
        try {
            const stats = await StatsService.getStats();
            return res.status(200).json({
                success: true,
                data: stats,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch stats',
            });
        }
    }

    static async getMetrics(_req: Request, res: Response) {
        try {
            await StatsService.refreshMetrics();
            res.set('Content-Type', register.contentType);
            res.end(await register.metrics());
        } catch (_error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch metrics',
            });
        }
    }
}
