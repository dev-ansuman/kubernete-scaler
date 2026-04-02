import { redis } from '../config/redis';
import { jobsProcessed, jobProcessingTime, jobErrors } from '../metrics/metrics'
import { REDIS_KEYS } from '../constants/redis';
import bcrypt from 'bcryptjs';
import { Job } from '../types/job.type';

export class WorkerService {
    static async startWorker() {
        console.log("Worker Started...");
        while (true) {
            try {
                const result = await redis.brpop(REDIS_KEYS.JOB_QUEUE, 0);

                if (!result) continue;

                const jobData = JSON.parse(result[1]) as Job;

                const start = Date.now();

                console.log(`Processing Job: ${jobData.id}`);
                const output = await this.processJob(jobData);

                const duration = (Date.now() - start) / 1000;

                jobProcessingTime.observe(duration);
                jobsProcessed.inc();

                const updatedPayload = JSON.stringify({
                    ...jobData,
                    status: 'completed',
                    result: output,
                    updatedAt: new Date().toISOString(),
                });

                await redis.set(REDIS_KEYS.jobStatus(jobData.id), updatedPayload);

                console.log(`Saved result for job: ${jobData.id} in redis`)

            } catch (error) {
                console.error(`Worker Error: ${error}`);
                jobErrors.inc();

                const workerError = error as Error & { jobId?: string };
                if (error instanceof Error && typeof workerError.jobId === 'string') {
                    const jobId = workerError.jobId;
                    const originalJob = await redis.get(REDIS_KEYS.jobStatus(jobId));
                    if (originalJob) {
                        const parsed = JSON.parse(originalJob) as Job;
                        await redis.set(
                            REDIS_KEYS.jobStatus(jobId),
                            JSON.stringify({
                                ...parsed,
                                status: 'failed',
                                error: error.message,
                                updatedAt: new Date().toISOString(),
                            })
                        );
                    }
                }
            }
        }
    }

    static async processJob(job: Job): Promise<unknown> {
        try {
            if (job.jobType === 'prime-up-to') {
                const limit = job.payload.limit ?? 100000;
                return { limit, count: this.countPrimesUpTo(limit) };
            }

            if (job.jobType === 'bcrypt-hash') {
                const text = job.payload.text ?? 'phase-2-load';
                const rounds = job.payload.rounds ?? 10;
                const hash = await bcrypt.hash(text, rounds);
                return { rounds, hash };
            }

            const size = job.payload.size ?? 100000;
            return this.sortLargeArray(size);
        } catch (error) {
            const wrapped = new Error(error instanceof Error ? error.message : 'job processing failed') as Error & { jobId: string };
            wrapped.jobId = job.id;
            throw wrapped;
        }
    }

    static countPrimesUpTo(limit: number): number {
        if (limit < 2) return 0;

        let count = 0;
        for (let n = 2; n <= limit; n++) {
            let isPrime = true;
            for (let i = 2; i * i <= n; i++) {
                if (n % i === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) count++;
        }
        return count;
    }

    static sortLargeArray(size: number) {
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 10_00_000));
        arr.sort((a, b) => a - b);

        return {
            size,
            min: arr[0],
            max: arr[arr.length - 1],
        };
    }
}
