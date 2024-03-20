const express = require("express");
const ProductsTable = require("../../models/productsTB");
const { logger } = require('../../utils');

const productsadd = async (request, response) => {
    try {
        const { name, category, image, subcategory, brand, year, subtype1, subtype2, subtype3, description, time_period, location, rent_status, price, availability, created_by } = request.body

        // Create a new user object with validated data
        const newUser = { name, category, image, subcategory, brand, year, subtype1, subtype2, subtype3, description, time_period, location, rent_status, price, availability, created_by };

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
    const { name, category, image, subcategory, brand, year, subtype1, subtype2, subtype3, description, time_period, location, rent_status, price, availability } = request.body
    try {
        const productId = request.body.id; // 
        const product = await ProductsTable.findById(productId);

        if (!product) {
            return response.status(404).json({ error: 'Product not found' });
        }

        // Update product fields
        product.name = name;
        product.category = category;
        product.image = image;
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

const productdetails = async (request, response) => {
    try {
        const prod_id = request.body.productId
        if (prod_id) {
            const product = await ProductsTable.findById(prod_id)
            if (!product) {
                return response.status(404).json({ error: 'Product not found' });
            }
            product.popularityCount = product.popularityCount + 1;
            const updatedProduct = await product.save();
            response.status(200).json({
                error: false,
                success: true,
                data: updatedProduct
            });
        }
    } catch (error) {
        logger.error(`Internal server error: ${error.message} in productdetails api`);
        response.status(500).json({ error: "An error occurred" });
    }
}

const popularproduct = async (request, response) => {
    try {
        const popularProducts = await ProductsTable.find().sort({ popularityCount: -1 }).limit(10);
        response.status(200).json({
            message: "success",
            error: false,
            success: true,
            data: popularProducts
        });

    }
    catch (error) {
        logger.error(`Internal server error: ${error.message} in popularproduct api`);
        response.status(500).json({ error: "An error occurred" });
    }
}

module.exports = { productsadd, productsedit, productlistbyuserid, productdetails, popularproduct }