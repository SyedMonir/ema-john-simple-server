const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
      // console.log(req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productsCollection.find(query);
      let products;
      if (page || size) {
        // 0 --> skip: 0 get: 0-10(10):
        // 1 --> skip: 1*10 get: 11-20(10):
        // 2 --> skip: 2*10 get: 21-30 (10):
        // 3 --> skip: 3*10 get: 21-30 (10):
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });

    app.get('/productsCount', async (req, res) => {
      const count = await productsCollection.estimatedDocumentCount();
      res.send({ count }); // evabe korle object akare pavo value
    });

    // Use POST to get products by ids
    app.post('/productsByKeys', async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      // console.log(keys);
      const query = { _id: { $in: ids } };
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
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
