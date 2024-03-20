const express = require("express");
const { logger } = require('../../utils');
const RentTable = require("../../models/rentdataTB");

const addrentdata = async (request, response) => {
    try {
        const { prod_id, created_by, start_date, end_date, amount } = request.body;
        if (prod_id && created_by && start_date && end_date && amount) {
            const newRental = new RentTable({
                prod_id,
                created_by,
                start_date,
                end_date,
                amount
            });
            await newRental.save();
            response.status(201).json({
                message: "Rental data added successfully",
                data: newRental,
                success: true,
                error: false
            });
        } else {
            response.status(400).json({ error: "Missing required fields" });
        }
    } catch (error) {
        logger.error(`Internal server error: ${error.message} in addrentdata API`);
        response.status(500).json({ error: "An error occurred" });
    }
}

const rented_data = async (request, response) => {
    try {
        const created_by=request.body.id
        if(created_by){
            const find=await RentTable.find({created_by:created_by})
            if(find){
                response.status(200).json({
                    data:find,
                    error:false,
                    success:true
                })
            }
        }
        else{
            response.status(400).json({ error: "Missing required field" });
        }

    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in addrentdata API`);
        response.status(500).json({ error: "An error occurred" });

    }
}

module.exports = { addrentdata, rented_data }