const express = require("express");
const { usersadd, login, editUser, userdetails, forgotPwd, otpLogin, resetPwd, googlesignin, resetpassword, emailverification } = require("./users.controller");

const usersRoutes = express.Router()

usersRoutes.post('/usersadd', usersadd)
usersRoutes.post('/login', login)
usersRoutes.post('/editUser', editUser)
usersRoutes.post('/userdetails', userdetails)
usersRoutes.post('/forgotPwd', forgotPwd)
usersRoutes.post('/resetpassword',resetpassword)
usersRoutes.post('/otpLogin', otpLogin)
usersRoutes.post('/resetPwd', resetPwd)
usersRoutes.post('/googlesignin', googlesignin)
usersRoutes.post('/emailverification',emailverification)

module.exports = usersRoutes   