const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('heroic playmates is playing smoothly with its valuable customers');
});

app.listen(port, (req, res) => {
    console.log(`server listening on ${port}`);
});