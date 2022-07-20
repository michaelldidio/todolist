
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const util = require('util');

const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors({}));

app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: 'localhost',
    port: '3360',
    user: 'root',
    password: 'root',
    database: 'midtermtodos',
});

const jwtSecretCode = "z2huwBbBPrEfCnMD";

// Register User
app.post('/api/register', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;


    try {

        const query = util.promisify(db.query).bind(db);

        const sqlQuery = "SELECT COUNT(email) as emailCount FROM users where email= ?"
        const resultEmail = await query(sqlQuery, email);
        const emailCount = resultEmail[0].emailCount;
        if (emailCount > 0) {
            res.status(409).send('Email account already exist')
            return;
        }

        const sqlQuery2 = "SELECT COUNT(username) as userCount FROM users where username= ?"
        const resultUsername = await query(sqlQuery2, username);
        const usernameCount = resultUsername[0].userCount;
        if (usernameCount > 0) {
            res.status(409).send('Username already exist')
            return;
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        res.send({ message: "Incorrect username or email format" })
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        const sqlInsert = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
        db.query(sqlInsert, [username, email, hash], (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                console.log(result);
                res.status(201).send('User created successfully');
            }
        })
    });

});

// Login
app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlQuery = "SELECT * FROM users where email=?"
    db.query(sqlQuery, email, (err, result) => {
        if (err) {
            console.log(err);

            res.status(500).send('Error while retrieving user');
            return;
        }
        console.log(result);
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    const id = result[0].id;
                    const token = jwt.sign({ id }, jwtSecretCode, {
                        expiresIn: 2 * 60 * 60, //2 hours
                    })

                    // req.session.user = result;

                    const user = {
                        username: result[0].username,
                        email: result[0].email,
                        id: result[0].id
                    }

                    // res.status(200).send(user);
                    res.json({ auth: true, token: token, user: user })
                } else {
                    res.json({ auth: false, message: "Wrong email / password combination" });
                }
            })
        }
        else {
            res.json({ auth: false, message: "Email account does not exist" });
        }
    })
});


const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.status(404).send("Token is missing. Try to re-login.")
    }
    else {
        jwt.verify(token, jwtSecretCode, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(400).send("Token might be expired. Try to logout and re-login");
                res.json({ auth: false, message: "Token might be expired. Try to logout and re-login" });
            }
            else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}


// ************************* TO DO *****************************
// Add to do
app.post('/api/todo', verifyJWT, (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const now = new Date();

    const sqlInsert = "INSERT INTO todo (authorId, creationTime, title, body) VALUES (?, ?, ?, ?)"
    db.query(sqlInsert, [req.userId, now, title, content], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send("Error adding new to do. Please try again");
        }
        else {
            console.log(result);
            res.sendStatus(201);
        }
    })
});

// Retrieve all todo
app.get('/api/todo', (req, res) => {
    const sqlQuery = "SELECT A.id as todoId, A.creationTime, A.title, A.body, U.username" +
        " FROM todo as A INNER JOIN users as U ON A.authorId = U.id ORDER BY A.id DESC"
    db.query(sqlQuery, (err, todo) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error trying to retrieve to do.");
        }
        else {
            console.log(todo);
            res.send(todo);
        }
    })
});

// Retrieve todos by author
app.get('/api/author/todo', verifyJWT, (req, res) => {
    const sqlQuery = "SELECT * FROM articles WHERE authorId = ?"
    db.query(sqlQuery, req.userId, (err, todo) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error trying to retrieve to do.");
        }
        else {
            console.log(sqlQuery);
            console.log(todo);
            res.send(todo);
        }
    })
});

app.get('/api/todo/:id', (req, res) => {
    const id = req.params.id;
    console.log("ID " + id);
    const sqlQuery = "SELECT A.id as todoId, A.creationTime, A.title, A.body, U.username" +
        " FROM articles as A INNER JOIN users as U ON A.authorId = U.id where A.id=?"
    db.query(sqlQuery, id, (err, todo) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error while retrieving the article");
        }
        else {
            if (todo.length > 0) {
                console.log(todo);
                res.send(todo);
            }
            else {
                res.status(404).send("To Do does not exist");
            }
        }
    })
});

// Update todo
app.put('/api/todo/:id', verifyJWT, (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.body;

    const sqlUpdate = "UPDATE todo SET title=?, body=? where id=?"
    db.query(sqlUpdate, [title, content, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send("Error updating the to do. Please try again");
        }
        else {
            console.log(result);
            res.sendStatus(201);
        }
    })
});

// Delete
app.delete('/api/todo/:id', verifyJWT, (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM todo where id=? and authorId=?"
    db.query(sqlDelete, [id, req.userId], (err, article) => {
        if (err) {
            res.status(500).send("Error trying to delete the todo")
            console.log(err);
        }
        else {
            console.log(article);
            res.send(article);
        }
    })
});

app.listen(3001, () => {
    console.log("running on port 3001")
});