const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzk2x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log('EmaJohn Database Connected');
    const productsCollection = client.db('emaJohn').collection('product');

    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get('/productsCount', async (req, res) => {
      // const query = {};
      // const cursor = productsCollection.find(query);
      const count = await productsCollection.estimatedDocumentCount();
      res.send({ count }); // evabe korle object akare pavo value
    });
  } finally {
    console.log('Finally');
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Ema-John On Fire..');
});

app.listen(port, () => {
  console.log('Ema-John On Fire..');
});
