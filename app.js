const express = require('express');
require('dotenv').config() //location as have in index.js
const app = express();
const morgan = require('morgan')
const cookieParse = require('cookie-parser')
const fileUpload = require('express-fileupload')

//for swagger-docs
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//regular middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
/**The “extended” syntax allows for rich objects and arrays to be encoded into the URL - encoded format,**/

//cookies and file upload
app.use(cookieParse())
app.use(fileUpload())

//this is simple morgan middleware
app.use(morgan('tiny'))

//import all routes
const home = require('./routes/home')
const user = require('./routes/user')


//router middleware
app.use('/api/v1', home)
app.use('/api/v1', user)

//export app.js
module.exports = app