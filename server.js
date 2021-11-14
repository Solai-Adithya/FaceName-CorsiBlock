const express = require('express')
const path = require('path')
const API = require('./database')
const crypto = require('crypto')
const db = new API()
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const homeURL = "http://localhost:8080"
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/facename/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })
const oneDay = 1000 * 60 * 60 * 24;

app.set("view engine", "ejs");
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay }
}));
app.use(express.static(path.join(__dirname, '/public')));
// app.use('/corsiblocktapping', require('./corsiblock'));

let allImages = [],
    names = [],
    affiliations = [];
async function fetchAllData() {
    const imageData = await db.fetchFaceData();
    console.log("Final image data: ", imageData);
    for (let i = 0; i < imageData.length; i++) {
        allImages.push(imageData[i].imageID);
        names.push(imageData[i].name);
        affiliations.push(imageData[i].affiliation);
    }
}
fetchAllData();

function scoreAnswers(correctAnswers, userAnswers) {
    let correct = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
        if (correctAnswers[i].toLowerCase() == userAnswers[i].toLowerCase()) correct++;
    }
    return correct;
}

function scoreBoth(userAnswersNames, userAnswersAffn) {
    let correct = 0;
    for (let i = 0; i < userAnswersNames.length; i++) {
        if (userAnswersNames[i].toLowerCase() == names[i].toLowerCase() && userAnswersAffn[i].toLowerCase() == affiliations[i].toLowerCase()) correct++;
    }
    return correct;
} 

function scoreRecall(correctAnswers, userAnswers) {
    let correct = 0;
    correctAnswers = correctAnswers.map(name => name.toLowerCase());
    userAnswers = userAnswers.map(name => name.toLowerCase());
    for (let i = 0; i < correctAnswers.length; i++) {
        if (userAnswers.includes(correctAnswers[i])) correct++;
    }
    return correct;
}

function convertStringToArray(text) {
    let userAnswers = text.replace(/(\r\n|\n|\r)/gm, ",");
    userAnswers = userAnswers.split(",");
    console.log("User Answers: ", userAnswers)
    return userAnswers;
}

//GET REQUESTS
app.get("/adminPanel.html", function(req, res) {
    res.redirect("/admin")
})

app.use('/corsiblocktapping', require('./corsi/server'));

app.get('/face-name', async function(req, res) {
    //TODO: after development, prevent this page being directly accessed before filling form.
    res.render('instructions', { redirectURL: homeURL + "/displayFaces", content: "You will be shown images of people. Observe and remember the faces. You will get time of 2 seconds per face." });
});

app.get('/', function(req, res) {
    res.render("input_page")
});


app.get("/namesTest1", function(req, res) {
    res.render("names", { formSubmitURL: "/names/test1" });
});
app.get("/namesTest2", function(req, res) {
    res.render("names", { formSubmitURL: "/names/test2" });
});

app.get("/displayFaces", function(req, res) {
    res.render('displayFaces.ejs', { redirectURL: homeURL+"/instructionsNames", images: allImages, figcaptions: [] });
})

app.get("/displayNames", function(req, res) {
    res.render('displayNames.ejs', { redirectURL: homeURL+"/nameTest", images: allImages, figcaptions: names });
})

app.get("/displayAffn", function(req, res) {
    res.render('displayAffn.ejs', { redirectURL: homeURL+"/affnTest", images: allImages, figcaptions: affiliations });
})

app.get("/instructionsNames", function(req, res) {
    res.render("instructions", { redirectURL: homeURL+"/displayNames", content: "You will be shown names of people. Observe and remember the faces and their names. You will get time of 2 seconds per face." })
})

app.get("/instructionsAffn", function(req, res) {
    res.render("instructions", { redirectURL: homeURL+"/displayAffn", content: "You will be shown affiliations of people. Observe and remember the faces and their affiliations. You will get time of 2 seconds per face." })
})

app.get("/nameTest", function(req, res) {
    res.render('oneInputTest.ejs', { redirectURL: homeURL+"/displayAffn", images: allImages, functionality: "Name" });
})

app.get("/affnTest", function(req, res) {
    res.render('oneInputTest.ejs', { images: allImages, functionality: "Occupation" });
})

//TODO: The follow two lines can be deleted?
app.get("/allTest1", function(req, res) {
    res.render('twoInputTest.ejs', { images: allImages, redirectURL: "/allTest/userAnswers/test1", formSubmitURL: "/allTest/userAnswers/test1" });
})
app.get("/allTest2", function(req, res) {
    res.render('twoInputTest.ejs', { images: allImages, redirectURL: "/", formSubmitURL: "/allTest/userAnswers/test2" });
}) //for now after test completion, redirect to home page

app.get("/admin", function(req, res) {
    res.sendFile('adminLogin.html', { root: './public/' })
})
app.get("/wait", function(req, res) {
    res.render('waitScreen.ejs', { redirectURL: homeURL+"/namesTest2"})
});

app.get("/instructionsAffn", function(req, res) {
    res.render("instructions", { redirectURL: "/displayAffn", content: "You will be shown affiliations of people. Observe and remember the faces and their affiliations. You will get time of 2 seconds per face." })
});

// adding image page from admin side 
app.get('/add_image', function (req, res) {
    res.render("add_image");
});


//POST REQUESTS
app.post("/", async function(req, res) {
    const formdata = req.body
    participantID = await db.newParticipant(formdata);
    req.session.participantID = participantID;
    // console.log("Participant ID is: ", participantID);
    res.render("main_page")
});
app.post("/names/test1", function(req, res) {
    let userAnswers = convertStringToArray(req.body.names);
    const score = scoreRecall(names, userAnswers)
    db.updateScore(req.session.participantID, 'recallNames_1' ,score);
    res.render("occupations", { formSubmitURL: "/occupationsTestPost1"});
});
app.post("/names/test2", function(req, res) {
    let userAnswers = convertStringToArray(req.body.names);
    const score = scoreRecall(names, userAnswers)
    db.updateScore(req.session.participantID, 'recallNames_2' ,score);
    res.render("occupations", { formSubmitURL: "/occupationsTestPost2"});
})

app.post("/occupationsTestPost1", async function(req, res) {
    let userAnswers = convertStringToArray(req.body.occupations);
    const score = scoreRecall(affiliations, userAnswers)
    db.updateScore(req.session.participantID, 'recallAffn_1', score);
    res.render('twoInputTest.ejs', { images: allImages, redirectURL: "/allTest/userAnswers/test1", formSubmitURL: "/allTest/userAnswers/test1" });
});
app.post("/occupationsTestPost2", async function(req, res) {
    let userAnswers = convertStringToArray(req.body.occupations)
    const score = scoreRecall(affiliations, userAnswers)
    db.updateScore(req.session.participantID, 'recallAffn_2', score)
    res.render('twoInputTest.ejs', { images: allImages, redirectURL: "/allTest/userAnswers/test2", formSubmitURL: "/allTest/userAnswers/test2" });
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

app.post("/nameTest/userAnswers", function(req, res) {
    console.log("User's answers: ", req.body);
    const score = scoreAnswers(names, req.body.userAnswers);
    db.updateScore(req.session.participantID, 'cuedRecall_name' ,score);
    res.send("Success")
})
app.post("/affnTest/userAnswers", function(req, res) {
    console.log("User's answers: ", req.body);
    const score = scoreAnswers(affiliations, req.body.userAnswers);
    db.updateScore(req.session.participantID, 'cuedRecall_affn' ,score);
    res.send("Success")
})
app.post("/allTest/userAnswers/test1", function(req, res) {
    console.log("User's answers for test1: ", req.body);
    const userAnswerNames = req.body.userAnswers[0], userAnswerAffn = req.body.userAnswers[1];
    const score = scoreBoth(userAnswerNames, userAnswerAffn);
    db.updateScore(req.session.participantID, 'cuedRecallAll_1' ,score);
    res.send("Success")   
})
app.post("/allTest/userAnswers/test2", function(req, res) {
    console.log("User's answers for test2: ", req.body);
    const userAnswerNames = req.body.userAnswers[0], userAnswerAffn = req.body.userAnswers[1];
    const score = scoreBoth(userAnswerNames, userAnswerAffn);
    db.updateScore(req.session.participantID, 'cuedRecallAll_2' ,score);
    res.send("Success")   
})


app.use('/public/facename/assets', express.static('public'));
app.post('/add_img', upload.single('profile-file'), async function(req, res, next) {
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    var num = await db.fetch_lastimg((obj.gender).toLowerCase());
    var img_num = (obj.gender.toLowerCase()) + num + ".jpeg";
    var num2 = await db.update_lastimg((obj.gender).toLowerCase(), num+1);
    imgID = await db.addNewFace(img_num, obj.name, obj.affiliation);
    // console.log("Image data is: ", imgID);
    res.render("completed");
});




var port = Number(process.env.PORT || 8080);
app.listen(port);
console.log("App running at port", port);
