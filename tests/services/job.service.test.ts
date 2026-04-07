import { JobService } from '../../apps/api-gateway/src/services/job.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { redis } from '../../apps/api-gateway/src/config/redis';
import { REDIS_KEYS } from '../../apps/api-gateway/src/constants/redis';

vi.mock('../../apps/api-gateway/src/config/redis', () => ({
    redis: {
        set: vi.fn(),
        lpush: vi.fn(),
        get: vi.fn(),
    },
}));

describe('JobService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should submit a new job and push it to redis queue', async () => {
        vi.mocked(redis.set).mockResolvedValue('OK');
        vi.mocked(redis.lpush).mockResolvedValue(1);

        const result = await JobService.submitJob({
            jobType: 'prime-up-to',
            payload: { limit: 20 },
        });

        expect(redis.set).toHaveBeenCalledTimes(1);
        expect(redis.lpush).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({ status: 'pending', jobType: 'prime-up-to' });
        expect(result.jobId).toBeDefined();
    });

    it('should return null when job status does not exist', async () => {
        vi.mocked(redis.get).mockResolvedValue(null);

        const result = await JobService.getJobStatus('some-job');

        expect(redis.get).toHaveBeenCalledWith(REDIS_KEYS.jobStatus('some-job'));
        expect(result).toBeNull();
    });

    it('should return parsed job status when job exists', async () => {
        vi.mocked(redis.get).mockResolvedValue(
            JSON.stringify({ id: 'existing-job', status: 'completed', result: { count: 4 } })
        );

        const result = await JobService.getJobStatus('existing-job');

        expect(redis.get).toHaveBeenCalledWith(REDIS_KEYS.jobStatus('existing-job'));
        expect(result).toEqual({ id: 'existing-job', status: 'completed', result: { count: 4 } });
    });
});