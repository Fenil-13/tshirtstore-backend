//try catch and we have to async await // use promise everyware

module.exports = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next)
}