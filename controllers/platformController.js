import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import {
    addAPlatform,
    deleteAPlatform,
    getAPlatform,
    getAllPlatforms,
    updatePlatform
} from "../db/queries.js";

// Create
const platformRouterCreatePost = [
    body("name").trim().notEmpty().withMessage("Platform name cannot be empty."),
    expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const platforms = await getAllPlatforms();
            return res.status(400).render("platformviews/platforms", {
                title: "New Platform Form",
                errors: errors.array(),
                platformId: null,
                platforms,
                formData: null
            });
        }
        await addAPlatform(req.body.name);
        res.redirect(`/platforms`);
    })
];

// Edit GET
const platformRouterEditGet = expressAsyncHandler(async (req, res) => {
    const platform = await getAPlatform(req.params.platform_id);
    const platforms = await getAllPlatforms();
    res.status(200).render("platformviews/platforms", {
        title: "Edit Platform Form",
        platformId: req.params.platform_id,
        platforms,
        formData: platform
    });
});

// Edit POST
const platformRouterEditPost = [
    body("name").trim().notEmpty().withMessage("Platform name cannot be empty."),
    expressAsyncHandler(async (req, res) => {
        const platform = await getAPlatform(req.params.platform_id);
        if (!platform) return res.status(404).send("Platform not found");

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const platforms = await getAllPlatforms();
            return res.status(400).render("platformviews/platforms", {
                title: "Edit Platform Form",
                errors: errors.array(),
                platformId: platform.platform_id,
                platforms,
                formData: req.body
            });
        }

        await updatePlatform(req.params.platform_id, req.body.name);
        res.redirect(`/platforms`);
    })
];

// Delete
const platformRouterDelete = expressAsyncHandler(async (req, res) => {
    const err = await deleteAPlatform(req.params.platform_id);
    const platforms = await getAllPlatforms();

    if (err) {
        return res.status(200).render("platformviews/platforms", {
            title: "Platforms",
            platforms,
            errorMessage: "The platform is associated with one or more games. Remove those games before deleting the platform.",
            formData: null,
            platformId: null
        });
    }

    res.redirect("/platforms");
});

export {
    platformRouterCreatePost,
    platformRouterEditPost,
    platformRouterDelete,
    platformRouterEditGet
};
