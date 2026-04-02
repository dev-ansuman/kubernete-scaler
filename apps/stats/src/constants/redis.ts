export const REDIS_KEYS = {
    JOB_QUEUE: 'jobs:queue',
    jobStatus: (jobId: string) => `jobs:status:${jobId}`,
} as const;
