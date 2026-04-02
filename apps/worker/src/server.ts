import env from 'dotenv';
env.config();

import app from './app';
import { WorkerService } from './services/worker.service';

const PORT = process.env.PORT;

const startWorker = async () => {
    app.listen(PORT, () => {
        console.log(`worker-service running on port ${PORT}`);
    });
    WorkerService.startWorker();
}

startWorker();