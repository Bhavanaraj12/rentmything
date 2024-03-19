const express = require("express");
const { bcrypt, logger, istDate } = require('../../utils');
const carttable = require("../../models/cartTB");


const cart = async (request, response) => {
    try {
        const { user_id, prod_id, status } = request.body
        if (user_id && prod_id) {
            const cartadd = await carttable.create({ user_id, prod_id, status })
            if (cartadd) {
                response.json({
                    message: "Successfully added to cart",
                    success: true,
                    error: false
                });
            } else {
                console.error("Error adding cart:", cartadd.error);
                response.status(500).json({ message: "An error occurred while adding the cart" });
            }
        }
    } catch (error) {
        console.error(error);
        logger.error(`Internal server error: ${error.message} in cart api`);
        response.status(500).json({ error: "An error occurred" });
    }
}


const getcart = async (request, response) => {
    try {
        const user_id = request.body.user_id
        if (user_id) {
            const data = await carttable.find({user_id}).populate('prod_id').populate('user_id');
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
        console.error(error);
        logger.error(`Internal server error: ${error.message} in getcart api`);
        response.status(500).json({ error: "An error occurred" });

    }
}

module.exports = { cart, getcart }
