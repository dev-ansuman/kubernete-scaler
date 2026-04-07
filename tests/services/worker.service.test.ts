import bcrypt from 'bcryptjs';
import { WorkerService } from '../../apps/worker/src/services/worker.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
    },
}));

const testDateTime = new Date().toISOString();

describe('WorkerService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should count primes correctly', () => {
        const result = WorkerService.countPrimesUpTo(10);
        expect(result).toBe(4);
    });

    it('should process prime-up-to job', async () => {
        const result = await WorkerService.processJob({
            id: 'job-1',
            status: 'pending',
            jobType: 'prime-up-to',
            payload: { limit: 10 },
            result: null,
            createdAt: testDateTime,
            updatedAt: testDateTime,
        });

        expect(result).toEqual({ limit: 10, count: 4 });
    });

    it('should process bcrypt-hash job', async () => {
        vi.mocked(bcrypt.hash).mockResolvedValue('hashed-value' as never);

        const result = await WorkerService.processJob({
            id: 'job-2',
            status: 'pending',
            jobType: 'bcrypt-hash',
            payload: { text: 'ansuman', rounds: 10 },
            result: null,
            createdAt: testDateTime,
            updatedAt: testDateTime,
        });

        expect(vi.mocked(bcrypt.hash)).toHaveBeenCalledWith('ansuman', 10);
        expect(result).toEqual({ rounds: 10, hash: 'hashed-value' });
    });
});