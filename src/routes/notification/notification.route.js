const express = require("express");
const UsersTable = require("../../models/usersTB");
const { bcrypt, logger } = require('../../utils');
const NotificationTable = require("../../models/notificationTB");


const cus_getnotification = async (request, response) => {
    try {
        const user_id = request.body.user_id
        if (user_id) {
            const get = await NotificationTable.find({ send_to: user_id })
            if (get) {
                response.status(200).json({
                    data: get,
                    success: true,
                    error: false
                })
            }
        }

    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in cus_getnotification api`);
        response.status(500).json({ error: "An error occurred" });

    }
}

const readnotification = async (request, response) => {
    try {
        const notification_id = request.body.id
        if (notification_id) {
            const read = await NotificationTable.findOneAndUpdate({ _id: notification_id },
                { $set: { read: "Y" } },
                { new: true } // Return the updated document)
            )
            response.status(200).json({
                success: true,
                error: false
            })
        }
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in readnotification api`);
        response.status(500).json({ error: "An error occurred" });
    }
}




module.exports = { cus_getnotification, readnotification }