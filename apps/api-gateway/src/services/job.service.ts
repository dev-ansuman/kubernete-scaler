import { redis } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types/job.type';

export class JobService {
    static async submitJob(input: number) {
        if (input === undefined || input === null) throw new Error('missing required field');
        const jobId = uuidv4();

        const job: Job = {
            id: jobId,
            status: 'pending',
            input,
            result: null
        }

        await redis.lpush("job_queue", JSON.stringify(job));

        return { jobId };
    }

    static async getJobStatus(jobId: string) {
        const data = await redis.get(`job.${jobId}`);
        if (!data) return null;

        return JSON.parse(data);
    }
}