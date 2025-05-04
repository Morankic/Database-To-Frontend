const { db } = require('./myDatabase');
const bcrypt = require('bcrypt');

async function getUSERS(email, password, isAdmin = false) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password, is_admin) VALUES (?, ?, ?)", [email, hashedPassword, isAdmin]);
    const [users] = await db.query("SELECT * FROM users;");
    console.log(users);
}

async function checkUserCredentials(email, password) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
        console.log("Korisnik nije pronađen.");
        return { success: false };
    }

    const hashedPassword = rows[0].password;

    if (!hashedPassword) {
        console.log("Heširana lozinka nije pronađena.");
        return { success: false };
    }

    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
        console.log("Pogrešna lozinka.");
        return { success: false };
    }

    const isAdmin = rows[0].is_admin;
    return { success: true, isAdmin };
}

async function setAdmin(currentUserEmail, targetEmail) {
    const [currentUserRows] = await db.query("SELECT * FROM users WHERE email = ?", [currentUserEmail]);

    if (currentUserRows.length === 0) {
        console.log("Trenutni korisnik nije pronađen.");
        return false;
    }

    const currentUser = currentUserRows[0];

    if (!currentUser.is_admin) {
        console.log("Nemate pravo dodavati admin privilegije.");
        return false;
    }

    const [targetUserRows] = await db.query("SELECT * FROM users WHERE email = ?", [targetEmail]);

    if (targetUserRows.length === 0) {
        console.log("Korisnik koji se pokušava postaviti kao admin nije pronađen.");
        return false;
    }

    await db.query("UPDATE users SET is_admin = TRUE WHERE email = ?", [targetEmail]);

    console.log(`${targetEmail} je sada admin.`);
    return true;
}


module.exports = { getUSERS, checkUserCredentials, setAdmin };
