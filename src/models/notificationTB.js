const mongoose = require('mongoose')
require('dotenv').config()
const mongoosedb = process.env.DATABASEURL

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema

var notificationschema = new schema({
    message: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    send_to: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    read: { type: String },
    type: { type: String }
}, {
    timestamps: true
})



const NotificationTable = mongoose.model("Notification", notificationschema);

module.exports = NotificationTable;