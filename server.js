var express = require('express')
var path = require('path')
var API = require('./database')
var crypto = require('crypto')
const db = new API()
var app = express()
var bodyParser = require("body-parser")
var participantID, facenameData;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/adminPanel.html", function(req, res) {
    res.redirect("/admin")
})

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, '/public')));
init();

app.use('/corsiblocktapping', require('./corsiblock'));
// app.use('/facename', require('./facename'));

app.get('/face-name', async function(req, res) {
    res.render('instructions', { redirectURL: "http://localhost:8080/displayFaces", content: "You will be shown images of people. Observe and remember the faces. You will get time of 2 seconds per face." });
});


app.get('/', function(req, res) {
    res.render("input_page")
});

app.post("/", async function(req, res) {
    const formdata = req.body
    participantID = await db.newParticipant(formdata);
    console.log("Participant ID is: ", participantID);
    res.render("main_page")
});

app.get('/api', (req, res) => {
    res.json({ message: "Hello from server!" });
});


// Showing names page recalled in last
app.get("/names", function(req, res) {
    res.render("names");
});
// handling the req 
app.post("/names", function(req, res) {
    const x = req.body
    console.log("\nNames recalled :-\n")
    console.log(x.names)
    res.render("occupations")
});

// Showing occupations page recalled in last
app.get("/occupations", function(req, res) {
    res.render("occupations");
});

// handling the req 
app.post("/occupations", function(req, res) {
    const x = req.body
    console.log("\nOccupation recalled :-\n")
    console.log(x.occupations)
    res.render("completed")
});

app.get("/admin", function(req, res) {
    res.sendFile('adminLogin.html', { root: './public/' })
})

app.post("/", async function(req, res) {
    const formdata = req.body
    participantID = await db.newParticipant(formdata);
    console.log("Participant ID is: ", participantID);
    res.render("main_page")
});

app.post("/login", async function(req, res) {
    const formdata = req.body
    const username = formdata.username,
        pwd = formdata.password,
        hashingKey = process.env.HASHING_KEY;
    const hashedpwd = crypto.createHmac('sha256', hashingKey).update(pwd).digest('hex');
    const pwdcheck = await db.checkAdmin(username, hashedpwd);
    if (pwdcheck) {
        res.sendFile('adminPanel.html', { root: './public/' })
    } else {
        res.send("Wrong username or password")
    }
})

app.get("/displayFaces", async function(req, res) {
    const imageData = await db.fetchFaceData("imageID");
    console.log("Final image data: ", imageData);
    let allImages = [];
    for (let i = 0; i < imageData.length; i++) {
        allImages.push(imageData[i].imageID);
    }
    res.render('displayFaces.ejs', { images: allImages, figcaptions: [] });
})

app.get("/displayNames", async function(req, res) {
    const imageData = await db.fetchFaceData("imageID, name");
    console.log("Final image data: ", imageData);
    let allImages = [],
        figcaptions = [];
    for (let i = 0; i < imageData.length; i++) {
        allImages.push(imageData[i].imageID);
        figcaptions.push(imageData[i].name);
    }
    res.render('displayNames.ejs', { images: allImages, figcaptions: figcaptions });
})

app.get("/displayAffn", async function(req, res) {
    const imageData = await db.fetchFaceData("imageID, affiliation");
    console.log("Final image data: ", imageData);
    let allImages = [],
        figcaptions = [];
    for (let i = 0; i < imageData.length; i++) {
        allImages.push(imageData[i].imageID);
        figcaptions.push(imageData[i].affiliation);
    }
    res.render('displayAffn.ejs', { images: allImages, figcaptions: figcaptions });
})

app.get("/instructionsNames", function(req, res) {
    res.render("instructions", { redirectURL: "http://localhost:8080/displayNames", content: "You will be shown names of people. Observe and remember the faces and their names. You will get time of 2 seconds per face." })
})

app.get("/instructionsAffn", function(req, res) {
    res.render("instructions", { redirectURL: "http://localhost:8080/displayAffn", content: "You will be shown affiliations of people. Observe and remember the faces and their affiliations. You will get time of 2 seconds per face." })
})

var port = Number(process.env.PORT || 8080);
app.listen(port);
console.log("App running at port", port);

function init() {
    facenameData = db.fetchData();
}