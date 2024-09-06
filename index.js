const express = require('express')
require('dotenv').config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvw2zcx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    const userCollection = client.db("furnFusion").collection("users");
    const cartCollection=client.db("furnFusion").collection("carts")
    const productCollection = client.db("furnFusion").collection("product");

    app.post("/users", async (req, res) => {
        const user = req.body;
      
        const query = { email: user.email };
        const existUser = await userCollection.findOne(query);
      
        if (existUser) {
          return res.send({ message: "user already exist" });
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      });
      
      app.get("/users", async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result);
      });

      app.get("/product",async(req,res)=>{
        const result= await productCollection.find().toArray()
        res.send(result)
      })

      app.post("/carts", async (req, res) => {
        const products = req.body;
        const result = await cartCollection.insertOne(products);
        res.send(result);
      });
  
      app.get("/carts/:email", async (req, res) => {
        const result = await cartCollection.find({email:req.params.email}).toArray();
        res.send(result);
      });

      app.delete("/carts/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
      });



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('FurniFusion are open')
})

app.listen(port,()=>{
    console.log(`FurniFusion are available ${port}`)
})