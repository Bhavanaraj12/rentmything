const express = require('express')
require('dotenv').config();
const PORT = process.env.PORT
const HOST = process.env.HOST

const server = express()
var bodyParser = require('body-parser')
const cors = require("cors");
const helmet = require("helmet");
const usersRoutes = require('./src/routes/users/users.routes');
const productsRoutes = require('./src/routes/products/products.routes');
const categorysubroutes = require('./src/routes/category_subcategory/categorysubcategory.routes');
const wishlistRoutes = require('./src/routes/wishlist/wishlist.routes');
const cartRoutes = require('./src/routes/cart/cart.routes');
server.use(cors({
    origin: "*",
    allowedHeaders: "X-Requested-With,Content-Type,auth-token,Authorization",
    credentials: true
  }))


server.use(express.json());

server.use(express.static('./public'))
server.use(express.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use('/user', usersRoutes)
server.use('/products',productsRoutes)
server.use('/categorysub',categorysubroutes)
server.use('/wishlist',wishlistRoutes)
server.use('/cart',cartRoutes)
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
 
if (process.env.NODE_ENV === "development") {
    server.listen(PORT, () => {
      console.log(`server started at ${HOST}:${PORT}`)
    }
    )
  }