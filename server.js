var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, '/public')));

app.use('/corsiblocktapping', require('./corsiblock'));

app.get('/face-name', function(req, res) {
  console.log("inside main server get route face-name\n")
  res.sendFile('facename/facename.html', { root: './public/'});
});

app.get('/', function(req, res) {
  return res.send('/index.html');
});

app.get('/api', (req, res) => {
  res.json({ message: "Hello from server!" });
});

var port = Number(process.env.PORT || 8080);
app.listen(port);
console.log("App running at port", port);