const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const username = process.env.DB_USERNAME;
const password = process.env.DB_USER_PASSWORD;

const uri =
  `mongodb+srv://${username}:${password}@cluster0.uz4gpo0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {

    const heroicCollection = client.db("heroicPlaymatesDB").collection("categories");
    const trendingCollection = client.db("heroicPlaymatesDB").collection('trending');

    app.get('/categories', async(req, res) => {
        const result = await heroicCollection.find().toArray();
        res.send(result);
    });

    app.get('trending', async( req, res ) => {
        const result = await trendingCollection.find().toArray();
        res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("heroic playmates is playing smoothly with its valuable customers");
});

app.listen(port, (req, res) => {
  console.log(`server listening on ${port}`);
});
