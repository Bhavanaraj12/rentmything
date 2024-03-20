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
const notificationRoutes = require('./src/routes/notification/notification.routes');
const bannerRoutes = require('./src/routes/banner/banner.routes');
const reviewRoutes = require('./src/routes/review/review.routes');
const rentRoutes = require('./src/routes/rentdata/rentdata.routes');
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
server.use('/notification',notificationRoutes)
server.use('/banner',bannerRoutes)
server.use('/review',reviewRoutes)
server.use('/rent',rentRoutes)

server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
 
if (process.env.NODE_ENV === "development") {
    server.listen(PORT, () => {
      console.log(`server started at ${HOST}:${PORT}`)
    }
    )
  }