const mongoose = require('mongoose');
require('dotenv').config();

const mongoosedb = process.env.DATABASE_URL;

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema;

var subcategory = new schema({
    name: { type: String },
    icon: { type: String },
    type: { type: String },
    // type_id: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
},
    {
        timestamps: true
    })

const subcategorytable = mongoose.model("subcategory", subcategory)

module.exports = subcategorytable