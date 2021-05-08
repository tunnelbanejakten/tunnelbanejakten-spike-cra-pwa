const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express();

app.use(cors());

app.use(express.static(
    path.join(__dirname, 'frontend/build')
));

app.get('/api/ping', (req, res) => {
    res.send({message: 'pong'})
})

const port = process.env.PORT || 5000

app.listen(port, function () {
    console.log(`👍 Server has started on port ${port}`)
});
