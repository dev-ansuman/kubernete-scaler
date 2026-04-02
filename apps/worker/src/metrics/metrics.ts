import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const jobsProcessed = new client.Counter({
    name: "jobs_processed_total",
    help: "Total number of jobs processed"
});

const jobProcessingTime = new client.Histogram({
    name: "job_processing_time_seconds",
    help: "Time taken to process jobs",
    buckets: [0.1, 0.5, 1, 2, 5]
});

const jobErrors = new client.Counter({
    name: "job_errors_total",
    help: "Total number of job errors"
});

register.registerMetric(jobsProcessed);
register.registerMetric(jobProcessingTime);
register.registerMetric(jobErrors);

export { register, jobsProcessed, jobProcessingTime, jobErrors };