const express = require('express');
const router = express.Router();

const Menu = require('./../models/Menu')

//for menu

router.get('/', async(req, res) => {
  try{
    const data =await Menu.find();
    console.log('data fatched');
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'})
  }
})

router.post('/', async(req, res) => {
  try{
    //assuming the request body contains the person data
    const data =req.body

    //create a new Person document using the Mongodb model
    const newMenu = await new Menu(data);

    //save the newperson to the database
    const response = await newMenu.save();
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
    const menuId = req.params.id;//extract ihe id from the url parameter
    const updatedmenuData = req.body;//update data from person

    const response =await Menu.findByIdAndUpdate(menuId,updatedmenuData,{
        new: true,//return the update document
        runValidators: true// Run mongoose validation
    })

    if(!response) {
        return res.status(404).json({error: 'Menu not found'});
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
    const menuId = req.params.id;//extract ihe id from the url parameter

    const response =await Menu.findByIdAndDelete(menuId)

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


//export router
module.exports = router;