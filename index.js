const express = require('express') ;
const cors = require('cors') ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express() ;
const port = process.env.PORT || 5202 ;

// middleware
app.use(cors()) ;
app.use(express.json()) ;

const uri = "mongodb+srv://smartdbUser:ZXRSaQLRbCm6NSic@cluster0.vm94rma.mongodb.net/?appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
    res.send('Smart server is running')
}) ;

async function run () {

    try{
        // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('smart_db') ;
    const productsCollection = db.collection('products') ;

    app.get('/products', async (req, res) => {
          const cursor = productsCollection.find() ;
          const result = await cursor.toArray() ;
          res.send(result) ;
    }) ;

    app.get('/products/:id', async (req, res) => {
        const id = req.params.id ;
        const query = { _id: new ObjectId(id)} 
        const result = await productsCollection.findOne(query) ;
        res.send(result)
    })

    app.post('/products', async (req, res) => {
        const newProducts = req.body ;
        const result = await productsCollection.insertOne(newProducts) ;
        res.send(result)
    }) ;

    app.patch('/products/:id', async (req, res) => {
        const id = req.params.id ;
        const updatedProduct = req.body ;
        const query = { _id: new ObjectId(id) }
        const update = {
            $set: {
                name: updatedProduct.name ,
                price: updatedProduct.price 
            }
        }
        const result = await productsCollection.updateOne(query, update) ;
        res.send(result) ;
    })

    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id ;
        const query = {_id: new ObjectId(id) } 
        const result = await productsCollection.deleteOne(query) ;
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally{

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`Smart server is running on port ${port}`)
}) ;


// client.connect()
// .then(() => {
    
// app.listen(port, () => {
//     console.log(`Smart server is running on now port ${port}`)
// }) ;
// })
// .catch(console.dir)

//Password
// ZXRSaQLRbCm6NSic