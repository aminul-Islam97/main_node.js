const mongoose = require('mongoose');

//Define  the person Schema
const menuSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
})
const Menu =mongoose.model('Menu',menuSchema);
module.exports = Menu;