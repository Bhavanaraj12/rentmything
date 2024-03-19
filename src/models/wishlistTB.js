const mongoose = require('mongoose');
require('dotenv').config();

const mongoosedb = process.env.DATABASE_URL;

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema;

var wishlistschema = new schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" }

},
    {
        timestamps: true
    })

const wishlisttable = mongoose.model("wishlist", wishlistschema)

module.exports = wishlisttable