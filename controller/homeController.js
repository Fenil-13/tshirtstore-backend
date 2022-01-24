const BigPromise = require('../middlewares/bigPromis')

exports.home = BigPromise(async (req, res) => {
    res.status(200).json({
        success: true,
        greeting: "Hello from Home API"
    })
})

exports.homeDummy = (req, res) => {
    res.status(200).json({
        success: true,
        greeting: "Hello from Home API another"
    })
}