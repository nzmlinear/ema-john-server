const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors= require('cors');

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggz8g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProducts',(req, res) => {
    const products=req.body;
    productsCollection.insertOne(products)
    .then(result =>{
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    })
  })
  app.get('/products',(req, res) => {
    productsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })
  app.get('/products/:key',(req, res) => {
    productsCollection.find({key:req.params.key})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })
  app.post('/productsByKeys',(req, res) => {
    const productkeys = req.body;
    productsCollection.find({key:{$in : productkeys}})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  app.post('/addOrders',(req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0 );
    })
  })
  console.log("Data Base Connected")
});



app.listen(process.env.PORT || port)