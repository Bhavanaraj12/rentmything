const express = require("express");
const categoryTable = require("../../models/categoryTB");
const subcategorytable = require("../../models/subcategoryTB");

const { logger } = require('../../utils');


const categoryadd = async (request, response) => {
    try {
        const { name, icon } = request.body;
        if (name && icon) {
            const add = await categoryTable.create({ name, icon });
            if (add) {
                response.json({
                    message: "Category added successfully",
                    success: true,
                    error: false
                });
            } else {
                console.error("Error adding category:", add.error);
                response.status(500).json({ message: "An error occurred while adding the category" });
            }
        } else {
            response.status(400).json({ message: "Missing name or icon in request body" });
        }
    } catch (error) {
        console.error("Error adding category:", error);
        logger.error(`Internal server error: ${error.message} in categoryadd api`);
        response.status(500).json({ error: "An error occurred while adding the category" });
    }
}


const getcategory = async (request, response) => {
    try {
        const name = request.body.name
        if (name) {
            const find = await categoryTable.find({ name: name })
            if (find) {
                response.json({
                    data: find,
                    success: true,
                    error: false
                });
            }
            else {
                console.error("Error getting getcategory:", find.error);
                response.status(500).json({ message: "An error occurred while getting the getcategory" });
            }
        } else {
            response.status(400).json({ message: "Missing name in request body" });
        }

    } catch (error) {
        console.error("Error getting category:", error);
        logger.error(`Internal server error: ${error.message} in getcategory api`);
        response.status(500).json({ error: "An error occurred while getting the category" });
    }
}



const subcategoryadd = async (request, response) => {
    try {
        const { name, icon, type } = request.body;
        if (name && icon && type) {
            const add = await subcategorytable.create({ name, icon, type });
            if (add) {
                response.json({
                    message: "Subcategory added successfully",
                    success: true,
                    error: false
                });
            } else {
                console.error("Error adding subcategory:", add.error);
                response.status(500).json({ message: "An error occurred while adding the subcategory" });
            }
        } else {
            response.status(400).json({ message: "Missing name or icon or type in request body" });
        }
    } catch (error) {
        console.error("Error adding subcategory:", error);
        logger.error(`Internal server error: ${error.message} in subcategoryadd api`);
        response.status(500).json({ error: "An error occurred while adding the subcategory" });
    }
}


const getsubcategory = async (request, response) => {
    try {
        const name = request.body.type
        if (name) {
            const find = await subcategorytable.find({ type: name })
            if (find) {
                response.json({
                    data: find,
                    success: true,
                    error: false
                });
            }
            else {
                console.error("Error getting getsubcategory:", find.error);
                response.status(500).json({ message: "An error occurred while getting the getsubcategory" });
            }
        } else {
            response.status(400).json({ message: "Missing name in request body" });
        }

    } catch (error) {
        console.error("Error getting subcategory:", error);
        logger.error(`Internal server error: ${error.message} in getsubcategory api`);
        response.status(500).json({ error: "An error occurred while getting the subcategory" });
    }
}

module.exports = { categoryadd, subcategoryadd, getcategory, getsubcategory }