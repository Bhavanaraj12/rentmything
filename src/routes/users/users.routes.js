const express = require("express");
const { usersadd,editUser ,userdetails} = require("./users.controller");

const usersRoutes = express.Router()

usersRoutes.post('/usersadd', usersadd)
usersRoutes.post('/editUser',editUser)
usersRoutes.post('/userdetails',userdetails)

module.exports = usersRoutes   
