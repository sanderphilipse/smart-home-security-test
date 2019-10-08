const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'app/build')));

app.use('/api', proxy('localhost:3000'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));