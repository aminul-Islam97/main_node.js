const express = require('express');
const router = express.Router();

//person added
const Person = require('./../models/Person');
const { route } = require('./menuRoutes');

//get method to get data
router.get('/', async(req, res) => {
  try{
    const data =await Person.find();
    console.log('data fatched');
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'})
  }
})


//post method to post data
router.post('/', async(req, res) => {
  try{
    //assuming the request body contains the person data
    const data =req.body

    //create a new Person document using the Mongodb model
    const newPerson = await new Person(data);

    //save the newperson to the database
    const response = await newPerson.save();
    console.log('data saved');
    res.status(200).json(response);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'})
  }
})



//put method to update data
router.put('/:id', async(req, res) => {
  try{
    const personId = req.params.id;//extract ihe id from the url parameter
    const updatedPersonData = req.body;//update data from person

    const response =await Person.findByIdAndUpdate(personId,updatedPersonData,{
        new: true,//return the update document
        runValidators: true// Run mongoose validation
    })

    if(!response) {
        return res.status(404).json({error: 'Person not found'});
    }

    console.log('data updated');
    res.status(200).json(response);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'})
  }
})


//delete method to delete data
router.delete('/:id', async(req, res) => {
  try{
    const personId = req.params.id;//extract ihe id from the url parameter

    const response =await Person.findByIdAndDelete(personId)

    if(!response) {
        return res.status(404).json({error: 'Person not found'});
    }

    console.log('data delete');
    res.status(200).json({Message:'person Deleted Successfully'});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'})
  }
})

module.exports =router;

