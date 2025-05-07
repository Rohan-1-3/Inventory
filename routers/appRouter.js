import { Router } from "express";
import { appGamesGet, appGet } from "../controllers/appController.js";

export const appRouter = new Router();

appRouter.get("/", appGet);

appRouter.get("/games", appGamesGet)

// search routing
