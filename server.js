const express = require('express');
const app = express();
const db = require('./db');

require('dotenv').config();

//bodyparser its a middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send(' i am not okay brother')
})


//import router file
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');

//use the routers
app.use('/person',personRoutes);
app.use('/menu',menuRoutes);


const PORT =process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Example app listening on port 3000`)
})