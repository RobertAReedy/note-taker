const express = require("express");
const path = require("path");
const app = express();
const PORT = 3001;
const fs = require("fs");
const shortId = require("shortid");

/*
Sends all static file (ones that don't manifest as objects)
over to the server at once, allowing the use of all style sheets
and whatever else is in "public"
*/
app.use(express.static("public"));
app.use(express.static("db"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    const jsonReading = fs.readFileSync("./db/db.json");
    // console.log(JSON.parse(jsonReading));
    res.send(jsonReading);
});

app.post("/api/notes", (req, res) => {
    let notes = null;

    notes = JSON.parse(fs.readFileSync("./db/db.json")); 
    if (notes === null) {
        notes = [];
    } 
    
    let newNote = {
        title: req.body.title, text: req.body.text,
        id: shortId.generate()
    };
    notes.push(newNote);
    
    // notes, null, unknown; look up (formats json rewrite, third param related to spacing and formatting)
    fs.writeFileSync("./db/db.json", JSON.stringify(notes), err => {
        if (err) throw err;
    });

    res.json(newNote);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});