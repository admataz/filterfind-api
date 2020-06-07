const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { Client } = require('pg')

module.exports = () => ({
  typeDefs,
  resolvers,
  context: async () => {
    const client = new Client()
    await client.connect()
    return {
      db: client
    }
  }
})
