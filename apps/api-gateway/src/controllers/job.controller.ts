import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { SubmitJobRequest } from '../types/job.type';

export class JobController {
    static async submitJob(req: Request, res: Response) {
        try {
            const { input } = req.body as SubmitJobRequest;

            if (typeof input !== 'number' || input <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid input. "input" must be a positive number.',
                })
            }

            const pushedToQueue = await JobService.submitJob(input);

            return res.status(201).json({
                success: true,
                data: pushedToQueue,
            })
        } catch (error) {
            console.error(`Job Controller Error: ${error}`);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            })
        }
    }

    static async getJobStatus(req: Request, res: Response) {
        try {
            const jobId = req.params.jobId as string;
            if (!jobId) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field: jobId',
                })
            }

            const job = await JobService.getJobStatus(jobId);
            if (!job) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found',
                });
            }

            return res.status(200).json({
                success: true,
                data: job
            })
        } catch (error) {
            console.error(`Job Controller Error: ${error}`);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            })
        }
    }
}