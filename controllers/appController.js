import expressAsyncHandler from "express-async-handler";
import { getAllGames } from "../db/queries.js";

const appGet = (req, res)=>{
    res.status(200).render("index", {
        title: "Home Page",
        games: null
    });
}

const appGamesGet = expressAsyncHandler(async (req, res)=>{
    const games = await getAllGames();
    res.status(200).render("index", {
        title: "Express App",
        games: games
    });
})



export { appGet, appGamesGet };