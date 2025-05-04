const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const cors = require('cors');
const { func } = require("./frontend/addToDataBase/index.js");
const { getUSERS, checkUserCredentials } = require('./mySQL.js');
const { setAdmin } = require('./mySQL.js');  

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// POST ruta za kreiranje korisnika
app.post('/user', (req, res) => {
    console.log(req.body);
    getUSERS(req.body.a, req.body.b);
});

// POST ruta za login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { success, isAdmin } = await checkUserCredentials(email, password);
    
    if (success) {
        res.json({ success: true, message: 'Login successful!', isAdmin });
    } else {
        res.json({ success: false, message: 'Invalid email or password.' });
    }
});


app.post('/setAdmin', async (req, res) => {
    const { currentUserEmail, targetEmail } = req.body;

    // Pozovi setAdmin funkciju sa trenutnim korisnikom (admin) i korisnikom kojem se dodeljuju privilegije
    const result = await setAdmin(currentUserEmail, targetEmail);

    // Vraćanje odgovora klijentu
    if (result.success) {
        res.json({ success: true, message: `${targetEmail} is now an admin.` });
    } else {
        res.json({ success: false, message: result.message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
