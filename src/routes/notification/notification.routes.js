const express = require("express");
const { cus_getnotification ,readnotification} = require("./notification.route");

const notificationRoutes = express.Router()

notificationRoutes.post('/cus_getnotification',cus_getnotification)
notificationRoutes.post('/readnotification',readnotification)


module.exports = notificationRoutes 