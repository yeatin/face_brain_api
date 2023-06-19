const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
//const knex = require('knex');
const CronJob = require('cron').CronJob;
/*
const { createClient } = require('@supabase/supabase-js');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
*/
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
//const db = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

const app = express();
app.use(express.json());
app.use(cors());

//scheduled call to DB to remain active
// const job = new CronJob("0 0 0 */6 * *", () => {
//     db
//     .from('login')
//     .select()
// }, null, true, "Asia/Taipei")
const job2 = new CronJob("* * * */6 * *", () => {
    console.log(new Date());
}, null, true, "Asia/Taipei")

app.get('/', (req, res) => res.status(200).send('it is working now'));
app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.handleProfile((req, res, db)));
app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));


app.listen(process.env.PORT || 5000, () => console.log(`app is running on ${process.env.PORT || 5000}`));