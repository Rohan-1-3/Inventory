import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { addADeveloper, deleteDeveloper, getADeveloper, getAllDevelopers, updateADeveloper } from "../db/queries.js";

const developerRouterGet = expressAsyncHandler(async(req, res)=>{
    const developer = await getADeveloper(req.params.developer_id);
    res.status(200).render("developerviews/developer",{
        developer: developer
    })
})

const developerRouterCreateGet = (req, res)=>{
    res.status(200).render("developerviews/newDeveloperForm",{
        title: "New Developer Form",
        developerId: null,
        formData: null
    })
}

const developerRouterCreatePost = [
    expressAsyncHandler(async(req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render("developerviews/newDeveloperForm",{
                title: "New Developer Form",
                errors: errors.array(),
                developerId: null,
                formData: req.body
            })
        }
        const developerId = await addADeveloper(req.body);
        res.redirect(`/developer/${developerId}`);
    })
]

const developerRouterEditGet = async(req, res)=>{
    const developer = await getADeveloper(req.params.developer_id)
    res.status(200).render("developerviews/newDeveloperForm",{
        title: "New Developer Form",
        developerId: developer.developer_id,
        formData: developer
    })
}

const developerRouterEditPost = [
    expressAsyncHandler(async(req, res)=>{
        const developer = await getADeveloper(req.params.developer_id)
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render("developerviews/newDeveloperForm",{
                title: "New Developer Form",
                errors: errors.array(),
                developerId: developer.developer_id,
                formData: req.body
            })
        }
        const developerId = await updateADeveloper(req.body);
        res.redirect(`/developer/${developerId}`);
    })
]

const developerRouterDelete = expressAsyncHandler(async(req, res)=>{
    const err = await deleteDeveloper(req.params.developer_id);
    
    if(err){
        const developers = await getAllDevelopers();
        return res.status(200).render("developerviews/developers",{
            title: "Developers",
            developers: developers,
            errorMessage: "The developer has game in inventory. Remove those games before deleting the developer."
        });
    }
    res.redirect("/developers");
})

export { developerRouterGet, developerRouterCreateGet, developerRouterCreatePost, developerRouterEditGet, developerRouterEditPost, developerRouterDelete };