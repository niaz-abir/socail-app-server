require("dotenv").config();

const express = require("express");
const port = process.env.PORT;
const cors = require("cors");
const { json, response } = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.icnwzoy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const run = async () => {
  const postsCollection = client.db("socialMediaAppDB").collection("posts");

  app.post("/posts/new", async (req, res) => {
    const response = await postsCollection.insertOne(req.body);
    res.json(response);
  });

  app.get("/posts", async (req, res) => {
    const result = await postsCollection.find({}).toArray();
    const sortedResult = result.sort((a, b) => b.love - a.love);
    console.log(sortedResult);
    res.send(sortedResult);
  });

  app.get("/detail/:id", async (req, res) => {
    const postId = req.params.id;
    const response = await postsCollection.findOne({ _id: ObjectId(postId) });

    console.log(response);
    res.json(response);
  });
};

run().catch((error) => console.error(error));

app.listen(port || 5000);
