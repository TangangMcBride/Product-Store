import express from "express";
import { PORT, MONGOURL } from "./config.js";
import mongoose, { connect } from "mongoose";
import { Product } from "./model/productsModel.js";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.status(202).send("<h1>Shit is Working</h1>");
});

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
//Add New Product
app.post("/products", async (req, res) => {
  try {
    if (!req.body.title || !req.body.price || !req.body.image) {
      return res.status(400).send({
        message: "Send all required fields:title, author, publishYear",
      });
    }
    const newproduct = {
      title: req.body.title,
      price: req.body.price,
      image: req.body.image,
    };

    const product = await Product.create(newproduct);
    res.status(200).send(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});
//show all Products
app.get('/products',async (req,res) => {
  try {
    const products = await Product.find({})
    res.status(202).json({count:products.length,
      data:products
    });
  } catch (error) {
    console.log(error)
    res.status(502).send({message:error.message})
  }
  
});
//Show One Product
app.get('/products/:id',async (req,res) => {
  try { 
    const {id} = req.params
    const product = await Product.findById(id)
    res.status(200).send(product)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message:error.message})
  }
});
//Update Product
app.put('/products/:id', async (req,res) => {
  try {
    if (!req.body.title || !req.body.price || !req.body.image) {
      return res.status(400).send({
        message: "Send all required fields:title, author, publishYear",
      });
    }
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body)
    if(!product){
      res.status(404).send("Product not Found")
    }
    res.status(200).send({message:"Product Successfully Updated"})
  } catch (error) {
    console.log(error)
    res.status(500).send({message:error.message})
  }
});
//Delete Product
app.delete('/products/:id', async (req,res)=>{
  try {
    const{id} = req.params
    const product = await Product.findByIdAndDelete(id)
    if(!product){
      res.status(404).send("Product not Found")
    }
    res.status(201).send({message:"Product Successfully Updated"})
  } catch (error) {
    console.log(error)
    res.status(500).send({message:error.message})
  }
});