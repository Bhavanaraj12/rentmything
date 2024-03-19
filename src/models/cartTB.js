const mongoose = require('mongoose');
require('dotenv').config();

const mongoosedb = process.env.DATABASE_URL;

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema;

var cartschema = new schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    status: { type: String }

}, 
{
    timestamps: true
})

const carttable = mongoose.model("cart", cartschema)

module.exports = carttable