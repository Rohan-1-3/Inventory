const appGet = (req, res)=>{
    res.status(200).render("index", {
        title: "Express App"
    });
}

export { appGet };