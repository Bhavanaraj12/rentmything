const express = require("express");
const { reviewadd, productreviews, deletereview } = require("./review.controller");



const reviewRoutes = express.Router()

reviewRoutes.post('/reviewadd', reviewadd)
reviewRoutes.post('/productreviews', productreviews)
reviewRoutes.post('/deletereview',deletereview)



module.exports = reviewRoutes