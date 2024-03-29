const express = require("express");
const { productsadd, productsedit,productlistbyuserid ,productdetails,popularproduct} = require("./products.controller");


const productsRoutes = express.Router()

productsRoutes.post('/productsadd', productsadd)
productsRoutes.post('/productsedit',productsedit)
productsRoutes.post('/prodlist',productlistbyuserid)
productsRoutes.post('/productdetails',productdetails)
productsRoutes.get('/popularproduct',popularproduct)

module.exports = productsRoutes   
