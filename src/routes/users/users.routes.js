const express = require("express");
const { usersadd, login, editUser, userdetails } = require("./users.controller");

const usersRoutes = express.Router()

usersRoutes.post('/usersadd', usersadd)
usersRoutes.post('/login',login)
usersRoutes.post('/editUser', editUser)
usersRoutes.post('/userdetails', userdetails)

module.exports = usersRoutes   
