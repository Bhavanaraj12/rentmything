const express = require("express");
const UsersTable = require("../../models/usersTB");
const { bcrypt, logger, jwt, istDate, nodemailer, otpGenerator, path, hbs, fs } = require('../../utils');


const usersadd = async (request, response) => {
    console.log("reqqqq",request.body)
    try {
        const { name, password, email, phone_number } = request.body;

        const mobileNumber = phone_number;
        if (!validateMobileNumber(mobileNumber)) {
            console.log('Invalid mobile number');
            const resptext = "Invalid mobile number";
            return response.send(resptext);
        }

        function validateMobileNumber(mobileNumber) {
            // Regular expression for a valid 10-digit Indian mobile number
            const mobileNumberRegex = /^[6-9]\d{9}$/;
            return mobileNumberRegex.test(mobileNumber);
        }

        const email_id = email;
        if (!validateEmail(email_id)) {
            console.log('Invalid email address');
            const resptext = "Invalid email address";
            return response.send(resptext);
        }

        function validateEmail(email_id) {
            // Regular expression for a simple email validation
            const emailRegex = /^[^\s@]+@gmail\.com$/;
            return emailRegex.test(email_id);
        }

        // Check if phone number already exists
        const existingUser = await UsersTable.findOne({ phone_number: phone_number });
        if (existingUser) {
            return response.status(400).json({ error: "Phone number already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 5);
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let otp = "";

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            otp += characters.charAt(randomIndex);
        }
        const hashedOtp = await bcrypt.hash(otp, 6);

        // Mailing section
        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.in",
            port: 465,
            auth: {
                user: "support@chaavie.com",
                pass: "GWExAA8yGEnC",
            },
            secure: true,
            tls: {
                rejectUnauthorized: false,
            },
        });
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve("./src/views"),
                defaultLayout: false,
            },
            viewPath: path.resolve("./src/views"),
        };

        transporter.use("compile", hbs(handlebarOptions));
        let mailOptions = {
            from: "support@chaavie.com",
            to: email,
            subject: "OTP Mail",
            template: "user_temp_otp",
            context: {
                username: name, 
                otp: otp,
            },
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                return
            }
            const newUser = { name, password: hashedPass, email, phone_number, temp_otp: hashedOtp, is_active: "N" };

            const addUserResult = UsersTable.create(newUser);

            if (addUserResult) {
                response.json({
                    message: "User added successfully",
                    success: true,
                    error: false
                });
            } else {
                console.error("Error adding user:", addUserResult.error);
                response.status(500).json({ message: "An error occurred while adding the user" });
            }
        })
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
            console.error("Duplicate key error:", error);
            return response.status(400).json({ error: "Email already exists" });
        } else {
            console.error("Error adding user:", error);
            logger.error(`Internal server error: ${error.message} in addUsers api`);
            response.status(500).json({ error: "An error occurred while adding the user" });
        }
    }
};

const emailverification = async (request, response) => {
    console.log("emailverification",request.body)
    const { email, otp } = request.body;

    if (!email || !otp) {
        logger.error(`email or otp field is empty in otpLogin api`)
        response.status(400).json({
            error: true,
            message: "email or otp field is empty",
        });
        return;
    }
    try {
        const user = await UsersTable.findOne({ email: email });
        if (!user) {
            response.status(400).json({
                error: true,
                message: "no user found!"
            });
        } else {
            const dbOtp = user.temp_otp;
            const result = await bcrypt.compare(otp, dbOtp);
            if (!result) {
                logger.error(`otp is not matching -in otpLogin api`);
                response.status(401).json({
                    error: true,
                    message: "otp is not matching!"
                });
            } else {
                const update = await UsersTable.updateOne({ email: email }, { $set: { is_active: "Y" } })
                if (update) {
                    response.status(200).json({
                        success: true,
                        message: "Email verified"
                    });
                }
            }
        }
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in emailverification api`);
        response.status(500).json({ error: "An error occurred" });

    }
}


const login = async (request, response) => {
    console.log("first", request.body);
    try {
        const { user_name, password } = request.body;
        let user;

        if (!password) {
            return response.status(401).json({
                error: true,
                success: false,
                message: 'Password required',
            });
        }

        if (user_name) {
            let query = {};
            if (typeof user_name === 'number') {
                user_name = user_name.toString(); // Convert number to string
                console.log({ user_name })
            }
            query = { $or: [{ email: user_name }, { phone_number: user_name }] };

            user = await UsersTable.findOne(query);
            console.log("user", user)
            if (!user) {
                return response.status(401).json({
                    error: true,
                    success: false,
                    message: 'Incorrect Email or Phone number!',
                });
            }
            else if (!user.is_active || user.is_active === "N") {
                return response.status(401).json({
                    error: true,
                    success: false,
                    message: 'Please verify your Email!',
                });

            }
        } else {
            return response.status(401).json({
                error: true,
                success: false,
                message: 'Email or phone number required',
            });
        }

        const hashedDbPassword = user.password;
        bcrypt.compare(password, hashedDbPassword, function (err, result) {
            if (err) {
                return response.status(500).json({
                    error: true,
                    success: false,
                    message: 'Password hashing error',
                });
            }

            if (!result) {
                return response.status(401).json({
                    error: true,
                    success: false,
                    message: 'Please check your password!',
                });
            }
            // const token = jwt.sign({
            //     id: user._id,
            //     name: user.name,
            //     email: user.email,


            //   },
            //     `${process.env.Token_password}`,
            //     { expiresIn: "60m" }
            //   )
            //   response.status(201).json({
            //     token: token,
            //     data: user,
            //     success: true,
            //     error: false
            //   });

            return response.status(200).json({
                success: true,
                error: false,
                login_id: user._id,
                name: user.name,
                email: user.email,
                message: 'Login successful',
            });
        });
    } catch (error) {
        logger.error(`Internal server error: ${error.message} in login api`);
        response.status(500).json({ error: "An error occurred" });
    }
}




const editUser = async (request, response) => {
    try {
        const userId = request.body.id;
        const { name, email, password, phone_number } = request.body;
        // Find the user by ID
        let user = await UsersTable.findById(userId);

        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }

        if (email && user.email !== email) {
            // Check if the new email already exists in the database
            const existingUser = await UsersTable.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return response.status(400).json({ error: "Email already exists" });
            }
            user.email = email;
        }

        if (name) user.name = name;
        // if (password) {
        //     const hashedPassword = await bcrypt.hash(password, 5);
        //     user.password = hashedPassword;
        // }
        if (phone_number && user.phone_number !== password) {
            user.phone_number = phone_number;
        }

        // Save the user
        user = await user.save();

        return response.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        return response.status(500).json({ error: "An error occurred while updating the user" });
    }
};

const userdetails = async (request, response) => {
    try {
        const userId = request.body.id;
        let user = await UsersTable.findById(userId);

        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        else {
            response.status(200).json({
                data: user,
                success: true,
                error: false
            })
        }
    } catch (error) {
        logger.error(`Internal server error: ${error.message} in userdetails api`);
        response.status(500).json({ error: "An error occurred while adding the user" });
    }
}

const forgotPwd = async (request, response) => {
    const { email } = request.body;
    try {
        if (email) {
            const user = await UsersTable.findOne({ email: email });

            if (!user) {
                response.status(404).json({ error: "User not found" });
            } else {
                const characters =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                let otp = "";

                for (let i = 0; i < 5; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    otp += characters.charAt(randomIndex);
                }
                const hashedOtp = await bcrypt.hash(otp, 5);
                console.log("hashedOtp", hashedOtp)
                await UsersTable.updateOne(
                    { email: user.email },
                    { $set: { temp_otp: hashedOtp } }
                );

                // Mailing section
                const transporter = nodemailer.createTransport({
                    host: "smtp.zoho.in",
                    port: 465,
                    auth: {
                        user: "support@chaavie.com",
                        pass: "GWExAA8yGEnC",
                    },
                    secure: true,
                    tls: {
                        rejectUnauthorized: false,
                    },
                });
                const handlebarOptions = {
                    viewEngine: {
                        partialsDir: path.resolve("./src/views"),
                        defaultLayout: false,
                    },
                    viewPath: path.resolve("./src/views"),
                };
                // console.log("Email HTML content:", fs.readFileSync(path.resolve("./src/views/user_temp_otp.handlebars"), 'utf8'));
                transporter.use("compile", hbs(handlebarOptions));
                let mailOptions = {
                    from: "support@chaavie.com",
                    to: email, // Use the user's email here
                    subject: "OTP Mail",
                    template: "user_temp_otp",
                    context: {
                        username: user.name, // Use the user_name from the user object
                        otp: otp,
                    },
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        return
                    }
                    response.status(201).json({
                        success: true,
                        error: false,
                        message: "OTP sent successfully",
                        data: user.user_id
                    });
                });
            }
        } else {
            logger.error(`email is undefined in forgotPwd `)
        }
    } catch (error) {
        console.log(error)
        logger.error(`Internal server error: ${error.message} in forgotPwd api`);
        response.send(error);
    }
};

const resetpassword = async (request, response) => {
    const { email, otp, password } = request.body;

    if (!email || !otp) {
        logger.error(`email or otp field is empty in resetpassword api`)
        response.status(400).json({
            error: true,
            message: "email or otp field is empty",
        });
        return;
    }
    try {
        const user = await UsersTable.findOne({ email: email });

        if (!user) {
            response.status(400).json({
                error: true,
                message: "no user found!"
            });
        } else {
            const dbOtp = user.temp_otp;
            const result = await bcrypt.compare(otp, dbOtp);
            if (!result) {
                logger.error(`otp is not matching -in otpLogin api`);
                response.status(401).json({
                    error: true,
                    message: "otp is not matching!"
                });
            } else {
                const hashedPass = await bcrypt.hash(password, 5);
                const update = await UsersTable.updateOne(
                    { email: email },
                    { $set: { password: hashedPass } }
                );
                response.status(200).json({
                    success: true,
                    message: "Password reset successful",
                });
            }

        }
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in resetpassword api`);
        response.status(500).json({
            error: true,
            mesageg: "Internal server error"
        });

    }
}

const otpLogin = async (request, response) => {
    const { email, otp } = request.body;

    if (!email || !otp) {
        logger.error(`email or otp field is empty in otpLogin api`)
        response.status(400).json({
            error: true,
            message: "email or otp field is empty",
        });
        return;
    }
    try {
        const user = await UsersTable.findOne({ email: email });

        if (!user) {
            response.status(400).json({
                error: true,
                message: "no user found!"
            });
        } else {
            const dbOtp = user.temp_otp;
            const result = await bcrypt.compare(otp, dbOtp);
            if (!result) {
                logger.error(`otp is not matching -in otpLogin api`);
                response.status(401).json({
                    error: true,
                    message: "otp is not matching!"
                });
            } else {
                response.status(200).json({
                    success: true,
                    message: "Login successful"
                });
            }
        }
    } catch (error) {
        logger.error(`Internal server error: ${error.message} in otpLogin api`);
        response.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

const resetPwd = async (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (!email || !password) {
        return response.status(400).json({
            error: true,
            message: "Please check fields",
        });
    }
    try {
        const hashedPass = await bcrypt.hash(password, 5);

        const update = await UsersTable.updateOne(
            { email: email },
            { $set: { password: hashedPass } }
        );
        response.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        logger.error(`Internal server error: ${error.message} in resetPwd api`);
        response.status(500).json({
            error: true,
            msg: "Internal server error",
        });

    }
};

const googlesignin = async (request, response) => {
    const email = request.body.email
    const googleid = request.body.googleid
    if (!email) {
        return response.status(400).json({
            error: true,
            message: "Please check email",
        });
    }
    try {
        const emailexist = await UsersTable.findOne({ email: email })
        if (emailexist) {
            const googleadd = await UsersTable.findOneAndUpdate({ email: email }, { $set: { google_id: googleid, is_active: "Y" } })
            if(googleadd){
            response.status(200).json({
                success: true,
                message: "Success",
            });
        }
        } else {
            const add = await UsersTable.create({ email: email, google_id: googleid, is_active: "Y" })
            if(add){
            response.status(200).json({
                success: true,
                message: "Success",
            });
        }
        }
    }
    catch (error) {
        console.log(error)
        logger.error(`Internal server error: ${error.message} in googlesignadd api`);
        response.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
}




module.exports = { usersadd, login, editUser, userdetails, forgotPwd, otpLogin, resetPwd, googlesignin, resetpassword, emailverification }