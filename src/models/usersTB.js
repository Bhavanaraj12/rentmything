const mongoose = require('mongoose');
require('dotenv').config();

const mongoosedb = process.env.DATABASE_URL;

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const schema = mongoose.Schema;

var usersSchema = new schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone_number: { type: String },
  // created_date: { type: Date },
  created_by: { type: String },
  temp_otp: { type: String },
  google_id: { type: String },
  is_active: { type: String }
  // modified_date: { type: Date }
},
  {
    timestamps: true
  });

const UsersTable = mongoose.model("users", usersSchema);

module.exports = UsersTable;
