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
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

//temp check
app.set('view engine', 'ejs')

//this is simple morgan middleware
app.use(morgan('tiny'))

//import all routes
const home = require('./routes/home')
const user = require('./routes/user')
const product = require('./routes/product')
const payment = require('./routes/payment')


//router middleware
app.use('/api/v1', home)
app.use('/api/v1', user)
app.use('/api/v1', product)
app.use('/api/v1', payment)

app.get('/api/v1/signuptest', (req, res) => {
    res.render('signup')
})
//export app.js
module.exports = app