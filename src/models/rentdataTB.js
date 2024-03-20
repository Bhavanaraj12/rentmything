const mongoose = require('mongoose')
require('dotenv').config()
const mongoosedb = process.env.DATABASEURL

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema

var rentdataschema = new schema({
    prod_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    amount: { type: Number },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    start_date: { type: Date },
    end_date: { type: Date }
}, {
    timestamps: true
})

const RentTable = mongoose.model("Rentdata", rentdataschema);

module.exports = RentTable;