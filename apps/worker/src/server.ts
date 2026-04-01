import { WorkerService } from './services/worker.service';

const invokeWorker = async () => {
    await WorkerService.startWorker();
}

invokeWorker();