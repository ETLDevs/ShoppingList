const path = require("path");
const Grocerie = require('../../models/grocerie')

const findItem = (req, res) => {
    const name = req.params.name;
    console.log(`name: ${name}`)
    Grocerie.find({name: name})
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        console.log(`findItem ERROR: ${err}`)
    })
}

module.exports = {findItem}