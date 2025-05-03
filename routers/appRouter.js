import { Router } from "express";
import { appGet } from "../controllers/appController.js";

export const appRouter = new Router();

appRouter.get("/", appGet);
