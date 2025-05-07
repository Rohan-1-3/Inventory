import { Router } from "express";
import { gameRouterCreateGet, gameRouterCreatePost, gameRouterDelete, gameRouterEditGet, gameRouterEditPost, gameRouterGet } from "../controllers/gameController.js";

export const gameRouter = new Router();

gameRouter.get("/create", gameRouterCreateGet);
gameRouter.post("/create", gameRouterCreatePost);

gameRouter.get("/:game_id", gameRouterGet);

gameRouter.get("/edit/:game_id", gameRouterEditGet);
gameRouter.post("/edit/:game_id", gameRouterEditPost);

gameRouter.post("/delete/:game_id", gameRouterDelete);
