const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const objectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yd5hs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanics");
    const servicesCollection = database.collection("services");

    // Get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services);
    });

    // Get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // POST method route
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
