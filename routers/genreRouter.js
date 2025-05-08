import { Router } from "express";
import { genreRouterCreatePost, genreRouterDelete, genreRouterEditGet, genreRouterEditPost } from "../controllers/genreController.js";

export const genreRouter = new Router();

genreRouter.post("/create", genreRouterCreatePost);

genreRouter.get("/edit/:genre_id", genreRouterEditGet)
genreRouter.post("/edit/:genre_id", genreRouterEditPost);

genreRouter.post("/delete/:genre_id", genreRouterDelete);
