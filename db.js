//first import mongoose
const mongoose = require('mongoose');

//Define the Mongodb connect URL
const mongoUrl ='mongodb://127.0.0.1:27017/login'

//set up mongodb connection
mongoose.connect(mongoUrl)

// get the defult connection
//Mongoose maintains a default connection object representing the mongodb connection.
const db =mongoose.connection;

//defiend event listenear

db.on('connected',()=>{
    console.log('connected to MongoDb server');
});

db.on('error',(err)=>{
    console.log('MongoDb connection error',err);
});

db.on('disconnected',()=>{
    console.log('Mongodb disconnected');
});

//exports the database connection
module.exports =db;