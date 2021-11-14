var express = require('express');
const path = require('path');
var router = express.Router();

router.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
    return res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = router;