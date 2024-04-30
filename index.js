const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    app.get("/tourists-spot-id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.findOne(query);
      res.send(result);
    });

    app.get("/tourists-spot/:email", async (req, res) => {
      const email = { email: req.params.email };
      const cursor = touristsSpotCollection.find(email);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/tourists-spot", async (req, res) => {
      const newTouristsSpot = req.body;
      const result = await touristsSpotCollection.insertOne(newTouristsSpot);
      res.send(result);
    });

    app.put("/tourists-spot-id/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTouristsSpot = req.body;
      const touristsSpot = {
        $set: {
          tourists_spot_name: updateTouristsSpot.tourists_spot_name,
          country_name: updateTouristsSpot.country_name,
          location: updateTouristsSpot.location,
          short_description: updateTouristsSpot.short_description,
          average_cost: updateTouristsSpot.average_cost,
          seasonality: updateTouristsSpot.seasonality,
          travel_time: updateTouristsSpot.travel_time,
          total_visitors_per_year: updateTouristsSpot.total_visitors_per_year,
          image: updateTouristsSpot.image,
        },
      };
      const result = await touristsSpotCollection.updateOne(
        filter,
        touristsSpot,
        options
      );
      res.send(result);
    });

    app.delete("/tourists-spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristsSpotCollection.deleteOne(query);
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
