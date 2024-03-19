const express = require("express");
const UsersTable = require("../../models/usersTB");
const { bcrypt, logger, istDate, nodemailer, otpGenerator } = require('../../utils');


const usersadd = async (request, response) => {
    try {
        const { name, password, email, phone_number } = request.body
        const created_date = istDate

        const mobileNumber = phone_number;
        if (validateMobileNumber(mobileNumber)) {
            console.log('Valid mobile number');
        } else {
            console.log('Invalid mobile number');
            const resptext = "Invalid mobile number"
            return response.send(resptext);
        }
        function validateMobileNumber(mobileNumber) {
            // Regular expression for a valid 10-digit Indian mobile number
            const mobileNumberRegex = /^[6-9]\d{9}$/;

            return mobileNumberRegex.test(mobileNumber);
        }
        // Example usage:
        const email_id = email;
        if (validateEmail(email_id)) {
            console.log('Valid email address');
        } else {
            console.log('Invalid email address');
            const resptext = "Invalid email address"
            return response.send(resptext);
        }
        function validateEmail(email_id) {
            // Regular expression for a simple email validation
            const emailRegex = /^[^\s@]+@gmail\.com$/;

            return emailRegex.test(email_id);
        }
        const hashedPass = await bcrypt.hash(password, 5);

        const newUser = { name, hashedPass, email, phone_number };

        const addUserResult = await UsersTable.create(newUser);

        if (addUserResult) {
            response.json({
                message: "User added successfully",
                success: true,
                error: false
            });
        } else {
            console.error("Error adding user:", addUserResult.error); // Handle specific errors from UsersTable
            response.status(500).json({ message: "An error occurred while adding the user" });
        }
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
            console.error("Duplicate key error:", error);
            return response.status(400).json({ error: "Email already exists" });
        }
        else {
            console.error("Error adding user:", error);
            logger.error(`Internal server error: ${error.message} in addUsers api`);
            response.status(500).json({ error: "An error occurred while adding the user" });
        }

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





module.exports = { usersadd, editUser, userdetails }