const express = require("express");
const { cart, getcart } = require("./cart.controller");


const cartRoutes = express.Router()

cartRoutes.post('/cartadd',cart)
cartRoutes.post('/getcart',getcart)

module.exports = cartRoutes   