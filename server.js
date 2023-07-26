const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
//const knex = require('knex');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

/*
//after the database was moved to supabase, knex is no longer needed
//and the db interface is now supabase's api system
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
          }
    }
});
*/

//supabase api
const db = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

const app = express();
app.use(express.json());
app.use(cors());

//scheduled call to DB to remain active
cron.schedule("* * * * Wednesday,Sunday", () => {
    db
    .from('login')
    .select()
    .then(user => console.log("Doing cron", new Date()))
    .catch(err => res.status(400).json('Cron not working'))
}, {timezone: "Asia/Taipei"})

app.get('/', (req, res) => res.status(200).send('it is working now'));
app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.handleProfile((req, res, db)));
app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));


app.listen(process.env.PORT || 5000, () => console.log(`app is running on ${process.env.PORT || 5000}`));