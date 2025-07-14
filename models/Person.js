const mongoose = require('mongoose');

//Define  the person Schema
const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number
    }
})
const Person =mongoose.model('Person',personSchema);
module.exports = Person;