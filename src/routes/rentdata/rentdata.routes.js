const express = require("express");
const { addrentdata, rented_data } = require("./rentdata.controller");



const rentRoutes = express.Router()

rentRoutes.post('/addrentdata', addrentdata)
rentRoutes.post('/renteddata', rented_data)


module.exports = rentRoutes