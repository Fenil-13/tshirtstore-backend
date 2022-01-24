const app = require('./app');
const connectWithDb = require('./config/db');

//connect with database
connectWithDb()

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: http://localhost:${process.env.PORT}/api/v1/ `);
})