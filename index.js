const express = require('express')
const path = require('path')

const app = express();

app.use(express.static(
    path.join(__dirname, 'frontend/build')
));

const port = process.env.PORT || 5000

app.listen(port);

console.log('👍 Server has started')
