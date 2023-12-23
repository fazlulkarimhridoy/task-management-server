const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibuouo3.mongodb.net/?retryWrites=true&w=majority`;

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

    // collections
    const tasks = client.db("taskDB").collection("tasks");


    // --------------------task related api--------------------
    app.get("/tasks", async(req, res)=>{
      const result = await tasks.find().toArray();
      res.send(result);
    })

    app.post("/tasks", async(req, res)=>{
      const taskData = req.body;
      const result = await tasks.insertOne(taskData);
      res.send(result);
    })

    app.put("/tasks/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = { _id : new ObjectId(id) };
      const options = { upsert : true };
      const updatedStatus = req.body;
      const status = {
        $set : {
          status : updatedStatus.status
        }
      };
      const result = await tasks.updateOne(filter, status, options);
      res.send(result);
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

// server status
app.get("/", (req, res) => {
    res.send("task management making server is running");
  });
  app.listen(port, () => {
    console.log(`task management server is running at port ${port}`);
  });
