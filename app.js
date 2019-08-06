const express = require('express');
const bodyParser = require('body-parser');

//defining the path of route files
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

//register the database and its models/tables
const sequelize = require('./util/database');
const Player = require('./models/player');
const Team = require('./models/team');
const Manager = require('./models/manager');

//declaring the table relations
Player.belongsTo(Team, { constraints: true, onDelete: 'CASCADE'});
Team.belongsTo(Manager, { constraints: true, onDelete: 'CASCADE'});

app.use(bodyParser.json()); // application/json

//setting the response headers prevent CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


//setting different URLs for each file
app.use('/manage', feedRoutes);
app.use('/auth', authRoutes);

//return error response if any error has occured
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ error: status, message: message, data: data });
});

//Syncing the database and then running the server
sequelize.sync()
.then(res =>{
    app.listen(8080);
})
.catch(err => {
    console.log(err);
});

