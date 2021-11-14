var express = require('express');
const path = require('path');
var router = express.Router();
const API = require('../database');
const db = new API()

router.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
    return res.sendFile(path.join(__dirname + '/index.html'));
});

router.post('/saveResults', async function(req, res) {
    console.log("Saving corsi results for participant id", req.session.participantID);
    var status = db.saveCorsiScore(req.session.participantID, req.body.correctCount, req.body.longestSpan);
    res.send(status);
})

module.exports = router;