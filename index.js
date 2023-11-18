const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgt34f5.mongodb.net/?retryWrites=true&w=majority`;

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

    const brandCollection = client.db('brandDB').collection('brand');
    const cartCollection = client.db('brandDB').collection('product');


    app.get('/brand', async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/brand/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await brandCollection.findOne(query);
      res.send(result);
    })


    app.post('/brand', async (req, res) => {
      const newbrand = req.body;
      console.log(newbrand);
      const result = await brandCollection.insertOne(newbrand);
      res.send(result);
    })

    app.put('/brand/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedproduct = req.body;

      const product = {
        $set: {
          name: updatedproduct.name,
          photo: updatedproduct.photo,
          brand: updatedproduct.brand,
          producttype: updatedproduct.producttype,
          price: updatedproduct.price,
          description: updatedproduct.description,
          rating: updatedproduct.rating
        }
      }

      const result = await brandCollection.updateOne(filter, product, options);
      res.send(result);
    })

    // cart 

    app.get('/product', async (req, res) => {
      const cursor = cartCollection.find();
      const carts = await cursor.toArray();
      res.send(carts);
    })

    app.post('/product', async (req, res) => {
      const newcart = req.body;
      console.log(newcart);
      const result = await cartCollection.insertOne(newcart);
      res.send(result);
    })

    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Brand Shop server is running')
})

app.listen(port, () => {
  console.log(`Brand Shop is running on port: ${port}`)
})