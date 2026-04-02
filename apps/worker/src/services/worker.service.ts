import { redis } from '../config/redis';
import { jobsProcessed, jobProcessingTime, jobErrors } from '../metrics/metrics'
import { REDIS_KEYS } from '../constants/redis';

export class WorkerService {
    static async startWorker() {
        console.log("Worker Started...");
        while (true) {
            try {
                const result = await redis.brpop(REDIS_KEYS.JOB_QUEUE, 0);

                if (!result) continue;

                const jobData = JSON.parse(result[1]);

                const start = Date.now();

                console.log(`Processing Job: ${jobData.id}`);
                const output = this.isPrime(jobData.input);

                const duration = (Date.now() - start) / 1000;

                jobProcessingTime.observe(duration);
                jobsProcessed.inc();

                await redis.set(
                    REDIS_KEYS.jobStatus(jobData.id),
                    JSON.stringify({
                        ...jobData,
                        status: 'completed',
                        result: output,
                        updatedAt: new Date().toISOString(),
                    })
                );

                console.log(`Saved result for job: ${jobData.id} in redis`)

            } catch (error) {
                console.error(`Worker Error: ${error}`);
                jobErrors.inc();
            }
        }
    }

    static isPrime(n: number): boolean {
        if (n <= 1) return false;

        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }
}