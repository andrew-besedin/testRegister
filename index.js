const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require('sqlite');
const sha256 = require("sha256");

const app = express();

function makeCookie(length) {
    let result = '';
    let characters = '0123456789abcdef';
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

app.use(express.json());
app.use(express.static("public"));

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.post("/registerPost", async (req, res) => {
    const db = await open({ filename: __dirname + '/database/base.db', driver: sqlite3.Database });
    const row = await db.get(`SELECT * FROM passwords WHERE login = "${req.body.login}"`);
    if (!row) await db.run(`INSERT INTO passwords(login, password, cookie) VALUES ("${req.body.login}", "${sha256(req.body.password + sha256(req.body.login))}", "${makeCookie(64)}")`);
    res.send({ ok: !row });
    db.close();
});

app.post("/loginPost", async (req, res) => {
    let db = await open({ filename: __dirname + '/database/base.db', driver: sqlite3.Database }); 
    const row = await db.get(`SELECT * FROM passwords WHERE login = "${req.body.login}" and password = "${sha256(req.body.password + sha256(req.body.login))}"`);
    res.send({ ok: !!row, cookie: row?.cookie, login: row?.login });
    db.close();
});

app.post("/cookieCheck", async (req, res) => {
    const db = await open({ filename: __dirname + '/database/base.db', driver: sqlite3.Database });
    const row = await db.get(`SELECT * FROM passwords WHERE cookie = "${req.body.cookie}"`);
    res.send({ ok: !!row, login: row?.login });
    db.close();
});

app.listen(3000);