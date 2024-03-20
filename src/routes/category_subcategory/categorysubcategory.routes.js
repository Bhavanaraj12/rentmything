const express = require("express");
const { allcategories, categoryadd, subcategoryadd, getcategory, getsubcategory } = require("./categorysubcategory.controller");

const categorysubroutes = express.Router()

categorysubroutes.get('/allcategories', allcategories)
categorysubroutes.post('/categoryadd', categoryadd)
categorysubroutes.post('/getcategory', getcategory)
categorysubroutes.post('/subcategoryadd', subcategoryadd)
categorysubroutes.post('/getsubcategory', getsubcategory)


module.exports = categorysubroutes   
