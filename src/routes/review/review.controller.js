const express = require("express");
const { bcrypt, logger } = require('../../utils');
const ReviewTable = require("../../models/reviewTB");
const RentTable = require("../../models/rentdataTB");

const reviewadd = async (request, response) => {
    try {
        const { prod_id, user_id, image, description, rating } = request.body
        if (!prod_id || !user_id) {
            const resptext = "Required fields are null"
            return response.send(resptext);
        }
        const rentdata = await RentTable.findOne({ prod_id: prod_id, created_by: user_id })
        if (rentdata) {
            const addreview = await ReviewTable.create({ prod_id, user_id, image, description, rating })
            if (addreview) {
                response.status(200).json({
                    message: "success",
                    success: true,
                    error: false
                })
            }
        } else {
            response.status(400).json({
                message: "Not a verified Purchaser",
                success: false,
                error: true
            })

        }

    }
    catch (error) {
        console.error("Error adding user:", error);
        logger.error(`Internal server error: ${error.message} in reviewadd api`);
        response.status(500).json({ error: "An error occurred" });

    }
}

const productreviews = async (request, response) => {
    try {
        const prod_id = request.body.prod_id
        if (!prod_id) {
            const resptext = "prod_id is null"
            return response.send(resptext)
        }
        const data = await ReviewTable.find({ prod_id: prod_id })
        if (data) {
            response.status(200).json({
                data: data,
                message: "success",
                success: true,
                error: false
            })

        }
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in productreviews api`);
        response.status(500).json({ error: "An error occurred " });

    }
}

const deletereview = async (request, response) => {
    try {
        const {user_id,prod_id}=request.body
        if (!prod_id || !user_id) {
            const resptext = "Required fields are null"
            return response.send(resptext);
        }        
            const deletereview = await ReviewTable.deleteOne({ prod_id:prod_id, user_id:user_id })
            if (deletereview) {
                response.status(200).json({
                    message: "success",
                    success: true,
                    error: false
                })
            }        
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in deletereview api`);
        response.status(500).json({ error: "An error occurred " });

    }
}

module.exports = { reviewadd, productreviews, deletereview }