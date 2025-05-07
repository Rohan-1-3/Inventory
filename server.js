import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { appRouter } from "./routers/appRouter.js";
import { gameRouter } from "./routers/gameRouter.js";
import { developerRouter } from "./routers/developerRouter.js";
import { genreRouter } from "./routers/genreRouter.js";
import { platformRouter } from "./routers/platformRouter.js";

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({extended: true}));

app.use("/", appRouter);
app.use("/game", gameRouter);
app.use("/developer", developerRouter);
app.use("/genre", genreRouter);
app.use("/platform", platformRouter);

app.use((req, res)=>{
    res.status(404).render("notFound",{
        title: "404 Error! Not Found."
    });
});

app.listen(PORT, ()=>console.log("App is listening at port: " + PORT));