const app = require('./app')


app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: http://localhost:${process.env.PORT}`);
})