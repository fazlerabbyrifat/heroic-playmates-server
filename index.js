const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const username = process.env.DB_USERNAME;
const password = process.env.DB_USER_PASSWORD;

const uri = `mongodb+srv://${username}:${password}@cluster0.uz4gpo0.mongodb.net/?retryWrites=true&w=majority`;

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
    const heroicCollection = client
      .db("heroicPlaymatesDB")
      .collection("categories");
    const trendingCollection = client
      .db("heroicPlaymatesDB")
      .collection("trending");
    const allToysCollection = client
      .db("heroicPlaymatesDB")
      .collection("allToys");

    app.get("/categories", async (req, res) => {
      const result = await heroicCollection.find().toArray();
      res.send(result);
    });

    app.get("/trending", async (req, res) => {
      const result = await trendingCollection.find().toArray();
      res.send(result);
    });

    

    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(query);
      res.send(result);
    });

    app.get("/allToys", async (req, res) => {
        const { search, page, email } = req.query;
        let query = search ? { name: { $regex: search, $options: "i" } } : {};
      
        if (email) {
          query.email = email;
        }
      
        const sort = req.query.sort;
        let sortQuery = {};
      
        if (sort === "asc") {
          sortQuery = { price: 1 };
        } else if (sort === "desc") {
          sortQuery = { price: -1 };
        }
      
        const limit = 20;
        const skip = page ? (parseInt(page) - 1) * limit : 0;
      
        try {
          const result = await allToysCollection
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortQuery)
            .toArray();
      
          result.forEach((toy) => {
            toy.price = parseFloat(toy.price);
          });
      
          res.send(result);
        } catch (error) {
          console.error(error);
          res.status(500).send("Error retrieving toys");
        }
      });
      

    app.post("/allToys", async (req, res) => {
      const newToy = req.body;
      const result = await allToysCollection.insertOne(newToy);
      res.send(result);
    });

    app.put("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: body.title,
          price: body.price,
          quantity: body.quantity,
          description: body.description,
        },
      };
      const result = await allToysCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.deleteOne(query);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
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
