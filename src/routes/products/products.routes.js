const express = require("express");
const { productsadd, productsedit,productlistbyuserid } = require("./products.controller");


const productsRoutes = express.Router()

productsRoutes.post('/productsadd', productsadd)
productsRoutes.post('/productsedit',productsedit)
productsRoutes.post('/prodlist',productlistbyuserid)

module.exports = productsRoutes   
