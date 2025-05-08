import expressAsyncHandler from "express-async-handler";
import { getAllDevelopers, getAllGames, getAllGenres, getAllPlatforms } from "../db/queries.js";

const appGet = (req, res)=>{
    res.status(200).render("index", {
        title: "Home Page",
    });
}

const appGamesGet = expressAsyncHandler(async (req, res)=>{
    const games = await getAllGames();
    res.status(200).render("gameviews/games", {
        title: "Games",
        games: games
    });
});

const appDevelopersGet = expressAsyncHandler(async (req, res)=>{
    const developers = await getAllDevelopers();
    res.status(200).render("developerviews/developers",{
        title: "Developers",
        developers: developers,
        errorMessage: null
    });
});

const appGenresGet = expressAsyncHandler(async(req, res)=>{
    const genres = await getAllGenres();
    res.status(200).render("genreviews/genres",{
        title: "Genres",
        genres: genres,
        genreId: null,
        formData: req.body
    });
});

const appPlatformsGet = expressAsyncHandler(async(req, res)=>{
    const platforms = await getAllPlatforms();
    res.status(200).render("platformviews/platforms",{
        title: "Platforms",
        platforms: platforms
    });
});

export { appGet, appGamesGet, appDevelopersGet, appGenresGet, appPlatformsGet };