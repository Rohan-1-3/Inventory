import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { appRouter } from "./routers/appRouter.js";

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({extended: true}));

app.use("/", appRouter);

app.use((req, res)=>{
    res.status(404).render("404",{
        title: "404 Error! Not Found."
    });
});

app.listen(PORT, ()=>console.log("App is listening at port: " + PORT));