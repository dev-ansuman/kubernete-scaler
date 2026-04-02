import { redis } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types/job.type';
import { REDIS_KEYS } from '../constants/redis';

export class JobService {
    static async submitJob(input: number) {
        if (input === undefined || input === null) throw new Error('missing required field');
        const jobId = uuidv4();

        const job: Job = {
            id: jobId,
            status: 'pending',
            jobType: 'prime-check',
            input,
            result: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        await redis.set(REDIS_KEYS.jobStatus(jobId), JSON.stringify(job));
        await redis.lpush(REDIS_KEYS.JOB_QUEUE, JSON.stringify(job));

        return { jobId, status: 'pending' as const };
    }

    static async getJobStatus(jobId: string) {
        const data = await redis.get(REDIS_KEYS.jobStatus(jobId));
        if (!data) return null;

        return JSON.parse(data);
    }
}