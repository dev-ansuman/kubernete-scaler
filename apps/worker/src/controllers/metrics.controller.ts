import { Request, Response } from 'express';
import { register } from '../metrics/metrics';

export class MetricsController {
    static async getMetrics(_req: Request, res: Response) {
        try {
            res.set("Content-Type", register.contentType);
            res.end(await register.metrics());
        } catch (error) {
            return res.status(500).json({
                error: "Failed to fetch metrics"
            });
        }
    }
}