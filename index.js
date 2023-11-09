const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5300




const uri = "mongodb+srv://<Name>:<Password>@cluster0.0gd1dng.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const userCollections = client.db("usersDB").collection("users");

        app.get("/users", async (req, res) => {
            const data = userCollections.find();
            const readyData = await data.toArray();
            res.send(readyData)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new User : ', user);
            const result = await userCollections.insertOne(user);
            res.send(result)
        })

        app.delete("/users/:id", async (req, res) => {
            let id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollections.deleteOne(query);
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = new ObjectId(id);
            const result = await userCollections.findOne(query);
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const body = req.body;
            const update = { $set: { name: body.name, email: body.email } };
            const options = { upsert: true };
            const result = await userCollections.updateOne(filter, update, options);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send({ message: "data is Loaded" })
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})