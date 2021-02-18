'use strict';



//Load environment variables from the .env file
require('dotenv').config();
// Step 1:  Bring in our modules/dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });

// Step 2:  Set up our application
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// declare port for server
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  db.select('*').from('task').then(data => {
    res.render('index', { todos: data });
  }).catch(err => res.status(400).json(err));
});

// create new task
app.post('/addTask', (req, res) => {
  const { textTodo } = req.body;
  db('task').insert({ task: textTodo }).returning('*')
    .then(_ => {
      res.redirect('/');
    }).catch(err => {
      res.status(400).json({
        message: 'unable to create a new task'
      });
    });
});

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App Listening on port: ${PORT}`);
      console.log(client.connectionParameters.database);
    });

  })