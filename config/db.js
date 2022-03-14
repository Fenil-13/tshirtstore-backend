const mongoose = require('mongoose')

const connectWithDb = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(console.log("DB Connected Successfully"))
        .catch(error => {
            console.log(`DB Connection issue ${error}`);
            process.exit(1)
        })
}

module.exports = connectWithDb