import { redis } from '../config/redis';

export class WorkerService {
    static async startWorker() {
        console.log("Worker Started...");
        while (true) {
            try {
                const result = await redis.brpop("job_queue", 0);

                if (!result) continue;

                const jobData = JSON.parse(result[1]);

                console.log(`Processing Job: ${jobData.id}`);
                const output = this.isPrime(jobData.input);

                await redis.set(
                    `job.${jobData.id}`,
                    JSON.stringify({
                        ...jobData,
                        status: 'completed',
                        result: output
                    })
                );

                console.log(`Saved result for job: ${jobData.id} in redis`)

            } catch (error) {
                console.error(`Worker Error: ${error}`);
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