const express = require("express");
const ProductsTable = require("../../models/productsTB");
const { logger } = require('../../utils');

const productsadd = async (request, response) => {
    try {
        const { name, category, subcategory, brand, year, subtype1, subtype2, subtype3, description, time_period, location, rent_status, price, availability, created_by } = request.body

        // Create a new user object with validated data
        const newUser = { name, category, subcategory, brand, year, subtype1, subtype2, subtype3, description, time_period, location, rent_status, price, availability, created_by };

        const productsadd = await ProductsTable.create(newUser);

        if (productsadd) {
            response.json({
                message: "Products added successfully",
                success: true,
                error: false
            });
        } else {
            console.error("Error adding user:", productsadd.error); // Handle specific errors from UsersTable
            response.status(500).json({ message: "An error occurred while adding the user" });
        }
    }
    catch (error) {
        console.error("Error adding user:", error);
        logger.error(`Internal server error: ${error.message} in addUsers api`);
        response.status(500).json({ error: "An error occurred while adding the user" });

    }
}

const productsedit = async (request, response) => {
    const { name, category, subcategory, brand, year, subtype1, subtype2, subtype3, description, time_period, location, rent_status, price, availability } = request.body
    try {
        const productId = request.body.id; // 
        const product = await ProductsTable.findById(productId);

        if (!product) {
            return response.status(404).json({ error: 'Product not found' });
        }

        // Update product fields
        product.name = name;
        product.category = category;
        product.subcategory = subcategory;
        product.brand = brand;
        product.year = year;
        product.subtype1 = subtype1;
        product.subtype2 = subtype2;
        product.subtype3 = subtype3;
        product.description = description;
        product.time_period = time_period;
        product.location = location;
        product.rent_status = rent_status;
        product.price = price;
        product.availability = availability;

        // Save the updated product
        const updatedProduct = await product.save();

        // Return the updated product
        response.status(200).json({
            message: "successfully edited the product",
            error: false,
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        console.error("Error adding user:", error);
        logger.error(`Internal server error: ${error.message} in productsedit api`);
        response.status(500).json({ error: "An error occurred while adding the user" });

    }
}

const productlistbyuserid = async (request, response) => {
    try {
        const id = request.body.id
        const proddata = await ProductsTable.find({ created_by: id })
        response.status(200).json({
            error: false,
            success: true,
            data: proddata
        });

    } catch (error) {
        console.error("Error adding user:", error);
        logger.error(`Internal server error: ${error.message} in productlistbyuserid api`);
        response.status(500).json({ error: "An error occurred while adding the user" });

    }
}

module.exports = { productsadd, productsedit, productlistbyuserid }