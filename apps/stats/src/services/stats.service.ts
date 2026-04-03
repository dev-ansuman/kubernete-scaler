import { redis } from '../config/redis';
import { REDIS_KEYS } from '../constants/redis';
import { queueLength, totalJobsCompleted, totalJobsSubmitted } from '../metrics/metrics';

type JobStatus = {
    status: 'pending' | 'completed' | 'failed';
    processingTimeSeconds?: number;
};

type CurrentStats = {
    totalJobsSubmitted: number;
    totalJobsCompleted: number;
    avgProcessingTimeSeconds: number;
    queueLength: number;
};

export class StatsService {
    static async getStats() {
        const currentStats = await this.calculateCurrentStats();

        totalJobsSubmitted.set(currentStats.totalJobsSubmitted);
        totalJobsCompleted.set(currentStats.totalJobsCompleted);
        queueLength.set(currentStats.queueLength);

        return currentStats;
    }

    static async refreshMetrics() {
        const currentStats = await this.calculateCurrentStats();

        totalJobsSubmitted.set(currentStats.totalJobsSubmitted);
        totalJobsCompleted.set(currentStats.totalJobsCompleted);
        queueLength.set(currentStats.queueLength);
    }

    private static async calculateCurrentStats(): Promise<CurrentStats> {
        const statusKeys = await redis.keys(REDIS_KEYS.JOB_STATUS_PATTERN);
        const queueLen = await redis.llen(REDIS_KEYS.JOB_QUEUE);

        const allStatuses = statusKeys.length > 0? await redis.mget(statusKeys): [];

        let submitted = statusKeys.length;
        let completed = 0;
        let totalProcessingTime = 0;

        for (const value of allStatuses) {
            if (!value) continue;
            const parsed = JSON.parse(value) as JobStatus;
            if (parsed.status === 'completed') {
                completed += 1;
                if (typeof parsed.processingTimeSeconds === 'number') {
                    totalProcessingTime += parsed.processingTimeSeconds;
                }
            }
        }

        const avgProcessingTimeSeconds = completed > 0? Number((totalProcessingTime / completed).toFixed(6)): 0;

        return {
            totalJobsSubmitted: submitted,
            totalJobsCompleted: completed,
            avgProcessingTimeSeconds,
            queueLength: queueLen,
        };
    }
}
