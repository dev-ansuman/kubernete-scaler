import { Request, Response } from 'express';
import { JobService } from '../services/job.service';

export class JobController {
    static async submitJob(req: Request, res: Response) {
        try {
            const { input } = req.body;

            if (typeof input !== 'number' || input <= 0) {
                return res.status(400).json({
                    error: "Invalid input"
                })
            }

            const pushedToQueue = await JobService.submitJob(input);

            return res.status(200).json({
                success: true,
                ...pushedToQueue
            })
        } catch (error) {
            console.error(`Job Controller Error: ${error}`);
            return res.status(500).json({
                error: 'Internal server error'
            })
        }
    }

    static async getJobStatus(req: Request, res: Response) {
        try {
            const jobId = req.params.jobId as string;
            if (!jobId) {
                return res.status(400).json({
                    error: 'missing required field'
                })
            }

            const job = await JobService.getJobStatus(jobId);

            return res.status(200).json({
                success: true,
                data: job
            })
        } catch (error) {
            console.error(`Job Controller Error: ${error}`);
            return res.status(500).json({
                error: "Internal server error"
            })
        }
    }
}