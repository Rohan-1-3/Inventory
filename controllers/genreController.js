import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { addAGenre, deleteAGenre, getAGenre, getAllGenres, updateGenre } from "../db/queries.js";

// Create
const genreRouterCreatePost = [
    body("name").trim().notEmpty().withMessage("Message cannot be empty."),
    expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const genres = await getAllGenres();
            return res.status(400).render("genreviews/genres", {
                title: "New Genre Form",
                errors: errors.array(),
                genreId: null,
                genres,
                formData: null
            });
        }
        await addAGenre(req.body.name);
        res.redirect(`/genres`);
    })
];

const genreRouterEditGet = expressAsyncHandler(async(req, res)=>{
    const genre = await getAGenre(req.params.genre_id);
    const genres = await getAllGenres();
    res.status(200).render("genreviews/genres", {
        title: "EditGenre Form",
        genreId: req.params.genre_id,
        genres,
        formData: genre
    });
})

// Edit
const genreRouterEditPost = [
    body("name").trim().notEmpty().withMessage("Message cannot be empty."),
    expressAsyncHandler(async (req, res) => {
        const genre = await getAGenre(req.params.genre_id);
        if (!genre) return res.status(404).send("Genre not found");

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const genres = await getAllGenres();
            return res.status(400).render("genreviews/genres", {
                title: "Edit Genre Form",
                errors: errors.array(),
                genreId: genre.genre_id,
                genres,
                formData: req.body
            });
        }

        await updateGenre(req.params.genre_id, req.body.name);
        res.redirect(`/genres`);
    })
];

// Delete
const genreRouterDelete = expressAsyncHandler(async (req, res) => {
    const err = await deleteAGenre(req.params.genre_id);

    const genres = await getAllGenres();
    if (err) {
        return res.status(200).render("genreviews/genres", {
            title: "Genres",
            genres,
            errorMessage: "The genre is associated with one or more games. Remove those games before deleting the genre.",
            formData: null,
            genreId:null
        });
    }

    res.redirect("/genres");
});

export {
    genreRouterCreatePost,
    genreRouterEditPost,
    genreRouterDelete,
    genreRouterEditGet
};
