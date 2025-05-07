import { Router } from "express";
import { developerRouterCreateGet, developerRouterCreatePost, developerRouterDelete, developerRouterEditGet, developerRouterEditPost, developerRouterGet } from "../controllers/developerController.js";

export const developerRouter = new Router();

developerRouter.get("/create", developerRouterCreateGet);
developerRouter.post("/create", developerRouterCreatePost);

developerRouter.get("/:developer_id", developerRouterGet);

developerRouter.get("/edit/:developer_id", developerRouterEditGet);
developerRouter.post("/edit/:developer_id", developerRouterEditPost);

developerRouter.post("/delete/:developer_id", developerRouterDelete);
