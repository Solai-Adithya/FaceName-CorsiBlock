var express = require('express');
var app = express();

app.use('/corsiblocktapping', require('./corsiblock'));

app.use('/facenameassociation', require('./facename'));

app.get('/', function(req, res) {
    return res.send('Home');
});

var port = Number(process.env.PORT || 8080);
app.listen(port);
console.log("App running at port", port);