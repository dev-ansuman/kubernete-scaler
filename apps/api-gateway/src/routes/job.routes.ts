import { Router } from "express";
import { JobController } from "../controllers/job.controller";

const jobRouter: Router = Router();

jobRouter.post("/submit", JobController.submitJob);
jobRouter.get("/status/:jobId", JobController.getJobStatus);

export { jobRouter };