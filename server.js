const express = require('express');
const app = express();
const port = 3001
const bodyParser = require('body-parser');
const cors = require('cors');
const {func} = require("./frontend/addToDataBase/index")

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.post('/user', (req, res) => {
    console.log(req.body);
    func();
})