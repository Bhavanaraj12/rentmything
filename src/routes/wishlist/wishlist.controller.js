const express = require("express");
const { logger } = require('../../utils');
const wishlisttable = require("../../models/wishlistTB");

const wishlist = async (request, response) => {
    try {
        const { user_id, prod_id } = request.body
        if (user_id && prod_id) {
            const wishlistadd = await wishlisttable.create({ user_id, prod_id })
            if (wishlistadd) {
                response.json({
                    message: "Successfully added to wishlist",
                    success: true,
                    error: false
                });
            } else {
                console.error("Error adding wishlist:", wishlistadd.error);
                response.status(500).json({ message: "An error occurred while adding the wishlist" });
            }
        }
    } catch (error) {
        console.error("Error adding user:", error);
        logger.error(`Internal server error: ${error.message} in wishlist api`);
        response.status(500).json({ error: "An error occurred" });
    }
}

const getwishlist = async (request, response) => {
    try {
        const user_id = request.body.user_id
        if (user_id) {
            const data = await wishlisttable.find({ user_id }).populate('prod_id').populate('user_id');
            if (data) {
                response.json({
                    data: data,
                    success: true,
                    error: false
                });

            }
            else {
                response.status(500).json({ message: "no data" });
            }
        }
    } catch (error) {
        console.error("Error adding user:", error);
        logger.error(`Internal server error: ${error.message} in wishlist api`);
        response.status(500).json({ error: "An error occurred" });
    }
}

const wishlistdelete = async (request, response) => {
    try {
        const wishlistid = request.body.id
        if (wishlistid) {
            const data = await wishlisttable.deleteOne({ wishlistid })
            if (data) {
                response.json({
                    message: "successfully deleted from wishlist",
                    success: true,
                    error: false
                });
            }
            else {
                response.status(500).json({ 
                    message: "error",
                     error: true });
            }
        }
    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in wishlist api`);
        response.status(500).json({ error: "An error occurred" });
    }
}


module.exports = { wishlist, getwishlist, wishlistdelete }