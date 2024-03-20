const mongoose=require('mongoose')
require('dotenv').config()
const mongoosedb=process.env.DATABASEURL

mongoose.connect(mongoosedb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const schema=mongoose.Schema

var bannerschema=new schema({
    image:{type:String},
    link:{type:String},
    prod_id: { type: schema.Types.Mixed }, // Using Mixed for JSON-like objects
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    duration:{type:String}    
},{
    timestamps:true
})

const BannerTable = mongoose.model("Banner", bannerschema);

module.exports = BannerTable;