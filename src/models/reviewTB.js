const mongoose = require('mongoose')
require('dotenv').config()
const mongoosedb = process.env.DATABASEURL

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema

var reviewschema = new schema({
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String },
    image: { type: String },
    rating: { type: String }
}, {
    timestamps: true
})

const ReviewTable = mongoose.model("Review", reviewschema);

module.exports = ReviewTable;