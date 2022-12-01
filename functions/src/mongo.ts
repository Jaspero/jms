import * as express from "express";
import {MongoClient} from "mongodb";
import bodyParser from 'body-parser';


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

app.get('/api/document/:moduleId', (req, res) => {
	res.send('Get document');
});

app.get('/api/documents/:moduleId', (req, res) => {
	async function exec() {
		res.send('Express + TypeScript Server');
	}

	exec()
		.then((data) => res.json(data))
		.catch();
});

app.post('/api/document/:moduleId', (req, res) => {
	async function exec() {
		return db.collection(req.params.moduleId).insertOne(req.body);
	}

	exec()
		.then(() => res.json({}))
		.catch();
});

app.put('/api/document/:moduleId', (req, res) => {
	res.send('Express + TypeScript Server');
});

app.delete('/api/document/:moduleId', (req, res) => {
	res.send('Express + TypeScript Server');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at https://localhost:${port}`);
});