var express = require('express');
var path = require('path');
var API = require('./database')
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/corsiblocktapping', require('./corsiblock'));

app.get('/face-name', function(req, res) {
  // console.log("inside main server get route face-name\n")
  res.sendFile('facename/facename.html', { root: './public/'});
});

app.get('/', function(req, res) {
  return res.send('/index.html');
});

app.get('/api', (req, res) => {
  res.json({ message: "Hello from server!" });
});




// Showing names page recalled in last
app.get("/names", function (req, res) {
    res.render("names");
});
// handling the req 
app.post("/names", function (req, res) {
    const x = req.body
    console.log("\nNames recalled :-\n")
    console.log(x.names)
    res.render("occupations")
});


// Showing occupations page recalled in last
app.get("/occupations", function (req, res) {
    res.render("occupations");
});
// handling the req 
app.post("/occupations", function (req, res) {
    const x = req.body
    console.log("\nOccupation recalled :-\n")
    console.log(x.occupations)
    res.render("completed")
});



const db = new API();

// WORKS AS EXPECTED
// fntest = async () => {
//   const participantID = await db.newParticipant({age: 25});
//   console.log(participantID);
// }

// fntest();


var port = Number(process.env.PORT || 8080);
app.listen(port);
console.log("App running at port", port);
