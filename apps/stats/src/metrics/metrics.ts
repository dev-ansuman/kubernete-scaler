import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const totalJobsSubmitted = new client.Gauge({
    name: 'total_jobs_submitted',
    help: 'Total number of submitted jobs',
});

const totalJobsCompleted = new client.Gauge({
    name: 'total_jobs_completed',
    help: 'Total number of completed jobs',
});

const queueLength = new client.Gauge({
    name: 'queue_length',
    help: 'Current queue length',
});

register.registerMetric(totalJobsSubmitted);
register.registerMetric(totalJobsCompleted);
register.registerMetric(queueLength);

export { register, totalJobsSubmitted, totalJobsCompleted, queueLength };
