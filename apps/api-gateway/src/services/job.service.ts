import { redis } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import { Job, JobPayload, JobType } from '../types/job.type';
import { REDIS_KEYS } from '../constants/redis';

export class JobService {
    static async submitJob(params: { jobType: JobType; payload: JobPayload }) {
        const jobId = uuidv4();
        const normalizedPayload = this.normalizePayload(params.jobType, params.payload);

        const job: Job = {
            id: jobId,
            status: 'pending',
            jobType: params.jobType,
            payload: normalizedPayload,
            result: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        await redis.set(REDIS_KEYS.jobStatus(jobId), JSON.stringify(job));
        await redis.lpush(REDIS_KEYS.JOB_QUEUE, JSON.stringify(job));

        return { jobId, status: 'pending' as const, jobType: params.jobType };
    }

    static async getJobStatus(jobId: string) {
        const data = await redis.get(REDIS_KEYS.jobStatus(jobId));
        if (!data) return null;

        return JSON.parse(data);
    }

    private static normalizePayload(jobType: JobType, payload: JobPayload): JobPayload {
        if (jobType === 'prime-up-to') {
            return { limit: payload.limit ?? 100000 };
        }
        if (jobType === 'bcrypt-hash') {
            return {
                text: payload.text ?? 'ansumanpanda',
                rounds: payload.rounds ?? 10,
            };
        }

        return { size: payload.size ?? 100000 };
    }
}