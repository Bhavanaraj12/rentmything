const mongoose = require('mongoose');
require('dotenv').config();

const mongoosedb = process.env.DATABASE_URL;

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema;

var category = new schema({
    name: { type: String },
    icon: { type: String }

},
    {
        timestamps: true
    })




const categoryTable = mongoose.model("category", category)

module.exports = categoryTable