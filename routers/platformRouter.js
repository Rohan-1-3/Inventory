import { Router } from "express";
import {
  platformRouterCreatePost,
  platformRouterDelete,
  platformRouterEditGet,
  platformRouterEditPost
} from "../controllers/platformController.js";

export const platformRouter = new Router();

platformRouter.post("/create", platformRouterCreatePost);

platformRouter.get("/edit/:platform_id", platformRouterEditGet);
platformRouter.post("/edit/:platform_id", platformRouterEditPost);

platformRouter.post("/delete/:platform_id", platformRouterDelete);