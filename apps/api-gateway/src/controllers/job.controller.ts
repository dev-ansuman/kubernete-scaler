import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { JobPayload, JobType, SubmitJobRequest } from '../types/job.type';

export class JobController {
    static async submitJob(req: Request, res: Response) {
        try {
            const { jobType = 'prime-up-to', payload = {} } = req.body as SubmitJobRequest;
            const validationError = JobController.validatePayload(jobType, payload);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    error: validationError,
                });
            }

            const pushedToQueue = await JobService.submitJob({ jobType, payload });

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

    private static validatePayload(jobType: JobType, payload: JobPayload): string | null {
        if (jobType === 'prime-up-to') {
            const limit = payload.limit ?? 100000;
            if (typeof limit !== 'number' || limit < 1000) {
                return 'Invalid payload for prime-up-to. limit must be a number >= 1000.';
            }
        }

        if (jobType === 'bcrypt-hash') {
            const text = payload.text ?? 'phase-2-load';
            const rounds = payload.rounds ?? 10;
            if (typeof text !== 'string' || text.length === 0) {
                return 'Invalid payload for bcrypt-hash. text must be a non-empty string.';
            }
            if (typeof rounds !== 'number' || rounds < 8 || rounds > 14) {
                return 'Invalid payload for bcrypt-hash. rounds must be a number between 8 and 14.';
            }
        }

        if (jobType === 'sort-array') {
            const size = payload.size ?? 100000;
            if (typeof size !== 'number' || size < 1000) {
                return 'Invalid payload for sort-array. size must be a number >= 1000.';
            }
        }

        return null;
    }
}