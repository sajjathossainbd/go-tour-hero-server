const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8i4eibr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const touristsSpotCollection = client
      .db("touristsSpotDB")
      .collection("touristsSpot");

      app.get("/tourists-spot", async (req, res) => {
        const cursor = touristsSpotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    app.post("/tourists-spot", async (req, res) => {
      const newTouristsSpot = req.body;
      const result = await touristsSpotCollection.insertOne(newTouristsSpot);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to goTour Hero Server Is Running");
});

app.listen(port, () => {
  console.log(`GoTour Hero Server Listening ${port}`);
});
