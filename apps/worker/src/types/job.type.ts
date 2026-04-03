type JobType = 'prime-up-to' | 'bcrypt-hash' | 'sort-array';

type JobPayload = {
    limit?: number;
    text?: string;
    rounds?: number;
    size?: number;
};

interface Job {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    jobType: JobType;
    payload: JobPayload;
    result: unknown;
    processingTimeSeconds?: number,
    error?: string;
    createdAt: string;
    updatedAt: string;
}

export type { JobType, JobPayload, Job }