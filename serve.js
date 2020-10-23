const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/dist'));

app.get('*', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, () => console.log(`Listening on port ${port}`));