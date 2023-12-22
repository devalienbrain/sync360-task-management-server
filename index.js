const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

// mongodb connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// console.log(process.env.DB_USER, process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m38robg.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// API to get all tasks
const tasksCollection = client.db("todoTaskDB").collection("allTasks");

app.get("/allTasks", async (req, res) => {
  console.log(req.query.email);

  let query = {};

  if (req.query?.email) {
    query = { addedByUser: req.query.email };
  }
  const result = await tasksCollection.find(query).toArray();
  res.send(result);
});

// API to create a new task
app.post("/allTasks", async (req, res) => {
  console.log("Request Body:", req.body);
  const item = req.body;
  console.log("From Client:", item);
  const result = await tasksCollection.insertOne(item);
  res.send(result);
});

// API to delete a task

app.delete("/allTasks/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await tasksCollection.deleteOne(query);
  res.send(result);
});

// connect to server
app.get("/", (req, res) => {
  res.send("SERVER is running!");
});

app.listen(port, () => {
  console.log(`SERVER running on port: ${port}`);
});
