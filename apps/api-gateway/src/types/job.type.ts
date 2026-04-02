interface Job {
    id: string,
    status: 'pending' | 'completed' | 'failed',
    jobType: 'prime-check',
    input: number,
    result: boolean | null,
    createdAt: string,
    updatedAt: string
}

interface SubmitJobRequest {
    input: number;
}

interface SubmitJobResponse {
    jobId: string;
    status: 'pending';
}

export type { Job, SubmitJobRequest, SubmitJobResponse }