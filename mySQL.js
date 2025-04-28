const {db}= require ('./myDatabase');

async function getUSERS(email, password){
    await db.query(`Insert into users (email,password) values("${email}","${password}")`)
    let users = await db.query( "SELECT * FROM users;")
    console.log(users);
};

async function checkUserCredentials(email, password) {
    let result = await db.query(`SELECT * FROM users WHERE email = "${email}" AND password = "${password}"`);
    return result.length > 0;
}
module.exports= {getUSERS,checkUserCredentials}
