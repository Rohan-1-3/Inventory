import expressAsyncHandler from "express-async-handler"
import { addAGame, deleteAGame, getAGame, getAllDevelopers, getAllGenres, getAllPlatforms, updateAGame } from "../db/queries.js";
import { body, validationResult } from "express-validator";

const validateGame = [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('release_date').optional().isISO8601().toDate().withMessage('Invalid release date'),
    body('completed_date').optional().isISO8601().toDate().withMessage('Invalid completed date'),
    body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
    body('status').isIn(['Pending', 'Playing', 'Completed', 'Dropped']).withMessage('Invalid status'),
    body('developer_id').isUUID().withMessage('Invalid developer ID'),
    body('description').optional().isString().trim(),
    body('cover_page_url').optional().isURL().withMessage('Invalid cover page URL'),
    body('genres').isArray({ min: 1 }).withMessage('Genres must be a non-empty array'),
    body('platforms').isArray({ min: 1 }).withMessage('Genres must be a non-empty array'),
];


const gameRouterGet = expressAsyncHandler(async(req, res)=>{
    const game = await getAGame(req.params.game_id);
    if (!game) {
        return res.status(404).render("notFound", {
            title: "", 
            message: "Game not found" });
    }
    res.status(200).render("gameviews/game", { game });
})

const gameRouterCreateGet = expressAsyncHandler(async(req, res)=>{
    const developers = await getAllDevelopers();
    const genres = await getAllGenres();
    const platforms = await getAllPlatforms();
    res.status(200).render("gameviews/newGameForm", {
        title: "New Game Form",
        developers: developers,
        genres: genres,
        platforms: platforms,
        gameId: null,
        formData: null
    })
})

const gameRouterCreatePost = [
    validateGame,
    expressAsyncHandler(async(req, res)=>{
        const developers = await getAllDevelopers();
        const genres = await getAllGenres();
        const platforms = await getAllPlatforms();
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).render("gameviews/newGameForm", {
                title: "New Game Form",
                developers: developers,
                genres: genres,
                platforms: platforms,
                errors: errors.array(),
                formData: req.body,
            });
        }
        const gameId = await addAGame(req.body)
        res.redirect(`/game/${gameId}`);
    })
]

const gameRouterEditGet = expressAsyncHandler(async(req, res)=>{
    const developers = await getAllDevelopers();
    const genres = await getAllGenres();
    const platforms = await getAllPlatforms();
    const game = await getAGame(req.params.game_id)
    console.log(game)
    res.status(200).render("gameviews/newGameForm", {
        title: "Edit Game Form",
        developers: developers,
        genres: genres,
        platforms: platforms,
        formData: game,
        gameId: game.game_id
    });
});

const gameRouterEditPost = [
    validateGame,
    expressAsyncHandler(async(req, res)=>{
        const developers = await getAllDevelopers();
        const genres = await getAllGenres();
        const platforms = await getAllPlatforms();
        const errors = validationResult(req)
        console.log(req.body)
        if(!errors.isEmpty()){
            return res.status(400).render("gameviews/newGameForm", {
                title: "Edit Game Form",
                developers: developers,
                genres: genres,
                platforms: platforms,
                errors: errors.array(),
                formData: req.body,
                gameId: req.params.game_id
            });
        }
        await updateAGame(req.params.game_id, req.body)
        res.redirect(`/game/${req.params.game_id}`);
    })
]

const gameRouterDelete = expressAsyncHandler(async(req, res)=>{
    await deleteAGame(req.params.game_id);
    res.redirect("/")
})

export { gameRouterGet, gameRouterCreateGet, gameRouterCreatePost, gameRouterEditGet, gameRouterEditPost, gameRouterDelete };