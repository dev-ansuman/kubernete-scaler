export const REDIS_KEYS = {
    JOB_QUEUE: 'jobs:queue',
    JOB_STATUS_PATTERN: 'jobs:status:*',
    jobStatus: (jobId: string) => `jobs:status:${jobId}`,
} as const;
