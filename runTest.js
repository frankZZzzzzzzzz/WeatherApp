import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.resolve("src/Website")));

app.get("/", (req, res) => {
    res.redirect("/Homepage/");
});

app.listen(3000, () => console.log("http://localhost:3000"));