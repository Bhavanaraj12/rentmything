const express = require("express");
const { wishlist, getwishlist, wishlistdelete } = require("./wishlist.controller");


const wishlistRoutes = express.Router()

wishlistRoutes.post('/wishlistadd', wishlist)
wishlistRoutes.post('/getwishlist', getwishlist)
wishlistRoutes.post('/wishlistdelete', wishlistdelete)


module.exports = wishlistRoutes   
