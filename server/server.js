import express from "express";
import { PORT, MONGOURL } from "./config.js";
import mongoose, { connect } from "mongoose";
import { Products } from "./model/productsModel.js";


const app = express();

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
  app.post('/products', async(req, res)=>{
    try {
      if (!req.body.title || !req.body.price || !req.body.image) {
        return res.status(400).send({
          message: "Send all required fields:title, author, publishYear",
        });
      }
      const newproduct = {
        title: req.body.title,
        price: req.body.price,
        image: req.body.image
      }

      const product = await Products.create(newproduct)
      res.status(200).send(product)

    } catch (error) {
      console.log(error.message)
      res.status(500).send({message:error})
    }

  }
  )