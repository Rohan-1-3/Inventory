import { Router } from "express";
import { appDevelopersGet, appGamesGet, appGet } from "../controllers/appController.js";

export const appRouter = new Router();

appRouter.get("/", appGet);

appRouter.get("/games", appGamesGet)

appRouter.get("/developers", appDevelopersGet)

// appRouter.get("/genres");

// appRouter.get("/platforms");

// search routing
