const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const {MongoClient} = require('mongodb');

app.use(express.json());

const url = process.env.db_conn;
const client = new MongoClient(url);

async function connectDb() {
    try{
        await client.connect();
        console.log('connected to mongodb');
    } catch (err) {
        console.error('error connecting to mongodb', err);
    }
}

connectDb();

const db = client.db('school');
const usersCollection = db.collection('users');

app.post('/signup', async (req,res) => {
    try {
        await usersCollection.insertOne(req.body);
        res.status(200).json({
            success:true
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "failed to create user"
        })
    }
})

app.post('/login', async (req,res) => {
    try {
        const user = await usersCollection.findOne({username});

        if (!user) {
            return res.status(400).json({
                msg: "invalid username or password"
            })
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "failed to login"
        })
    }
})

app.get('/', (req, res) => {
    res.send('login page');
})

app.listen(process.env.port, () => {
    console.log(`Server is listening on port ${process.env.port}`);
})