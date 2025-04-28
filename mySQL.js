var db = require('mysql2-promise')();

db.configure({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "users"
});
 
module.exports = {db}

async function getUSERS(){
    let users = await db.query( "SELECT * FROM users;")
    console.log(users);
};

getUSERS()
