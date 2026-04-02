import { redis } from '../config/redis';
import { REDIS_KEYS } from '../constants/redis';
import { queueLength, totalJobsCompleted, totalJobsSubmitted } from '../metrics/metrics';

type JobStatus = {
    status: 'pending' | 'completed' | 'failed';
};

export class StatsService {
    static async getStats() {
        const statusKeys = await redis.keys('jobs:status:*');
        const queueLen = await redis.llen(REDIS_KEYS.JOB_QUEUE);

        const allStatuses = statusKeys.length > 0
            ? await redis.mget(statusKeys)
            : [];

        let submitted = statusKeys.length;
        let completed = 0;

        for (const value of allStatuses) {
            if (!value) continue;
            const parsed = JSON.parse(value) as JobStatus;
            if (parsed.status === 'completed') completed += 1;
        }

        totalJobsSubmitted.set(submitted);
        totalJobsCompleted.set(completed);
        queueLength.set(queueLen);

        return {
            totalJobsSubmitted: submitted,
            totalJobsCompleted: completed,
            queueLength: queueLen,
        };
    }
}