import { Router } from "express";
import { appDevelopersGet, appGamesGet, appGenresGet, appGet, appPlatformsGet } from "../controllers/appController.js";

export const appRouter = new Router();

appRouter.get("/", appGet);

appRouter.get("/games", appGamesGet)

appRouter.get("/developers", appDevelopersGet)

appRouter.get("/genres", appGenresGet);

appRouter.get("/platforms", appPlatformsGet);

// search routing
