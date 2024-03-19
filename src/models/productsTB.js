const mongoose = require('mongoose');
require('dotenv').config();

const mongoosedb = process.env.DATABASE_URL;

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema;

var products = new schema({
    name: { type: String },
    category: { type: String },
    subcategory: { type: String },
    brand: { type: String },
    year: { type: Number },
    subtype1: { type: String },
    subtype2: { type: String },
    subtype3: { type: String },
    description: { type: String },
    time_period: { type: String },
    location: { type: String },
    price: { type: Number },
    availability: { type: String },
    rent_status: { type: Boolean },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    // created_date:{type:Date},
    // modified_date:{type:Date}

},
    {
        timestamps: true
    })

const ProductsTable = mongoose.model("products", products)

module.exports = ProductsTable

