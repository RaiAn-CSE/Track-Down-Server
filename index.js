const express = require('express');
const cors = require('cors');

const app = express()

// Middleware 
app.use(cors())
app.use(express.json())

require('dotenv').config()

// var jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000

// const stripe = require("stripe")(process.env.STRIPE_SK);
app.get('/', async (req, res) => {
    res.send('Track Down server is running');
})
app.listen(port, () => {
    console.log("Track Down server is running on port", port);
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3exxtfz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'Unauthorized access' })
//     }
//     const token = authHeader.split('')[1]

//     jwt.sign(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//         if (err) {
//             return res.status(401).send({ message: 'Unauthorized access' })
//         }
//         req.decoded = decoded
//         next()
//     });
// }

async function run() {

    // all collections
    const postCollection = client.db("Track-Down").collection("posts")
    const userCollection = client.db("Track-Down").collection("users")



    // products 
    app.post('/posts', async (req, res) => {
        const data = req.body;
        const result = await postCollection.insertOne(data)
        res.send(result)
    })



    // app.post('/jwt', async (req, res) => {
    //     const data = req.body;
    //     const token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '24h' });
    //     res.send({ token })
    // })

    app.get('/posts', async (req, res) => {
        const postData = postCollection.find({}).sort({ timestamp: -1 });
        const result = await postData.toArray();
        const reversedResult = result.reverse();
        res.send(reversedResult)
    })

    // users 
    app.post('/users', async (req, res) => {
        const data = req.body;
        const result = await userCollection.insertOne(data)
        res.send(result)
    })

    app.get('/users', async (req, res) => {
        const postData = userCollection.find({})
        const result = await postData.toArray()
        res.send(result)
    })




}

run().catch(error => { console.log(error); })
