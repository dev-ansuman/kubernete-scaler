export interface Job {
    id: string,
    status: 'pending' | 'completed' | 'failed',
    input: number,
    result: boolean | null
}