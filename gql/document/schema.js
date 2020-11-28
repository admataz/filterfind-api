const fs = require('fs')
const schema = fs.readFileSync(`${__dirname}/schema.graphql`)
module.exports = schema.toString()
