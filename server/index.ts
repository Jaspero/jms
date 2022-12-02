import * as express from "express";
import {MongoClient, ObjectId} from 'mongodb';

const app = express();
const port = 5200;

app.use(express.json());

const uri =
  "mongodb://0.0.0.0:27017/jms";
// Create a new MongoClient
const client = new MongoClient(uri);
client.connect().catch();
client.db("admin").command({ping: 1}).catch();
const db = client.db("jms");

app.get('/api/document/:moduleId/:documentId', (req, res) => {
  return db.collection(req.params.moduleId).findOne({_id: new ObjectId(req.params.documentId)})
    .then((data) => res.json(data))
    .catch();
});

app.post('/api/document/:moduleId', (req, res) => {
  async function exec() {
    return db.collection(req.params.moduleId).insertOne(req.body)
      .then((data) => res.json(data))
      .catch();
  }

  exec()
    .then(() => res.json({}))
    .catch();
});

app.put('/api/document/:moduleId', (req, res) => {
  return db.collection(req.params.moduleId).updateOne({_id: new ObjectId(req.params.documentId)}, {
    $set: req.body
  })
    .then((data) => res.json(data))
    .catch();
});

app.delete('/api/document/:moduleId', (req, res) => {
  return db.collection(req.params.moduleId).deleteOne({_id: new ObjectId(req.params.documentId)})
    .then((data) => res.json(data))
    .catch();
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
