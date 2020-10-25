/*
    server Graphql utilizand graphql-yoga
*/

// import modul graphql-yoga
const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
    type Query {
        hello(name: String): String!
    }

`
const resolvers = {
    Query : {
        hello: (_, { name }) => `Hello ${name || 'World'}`,
    },
}

const options = {
    port: 5000
}

// initializare server
const server = new GraphQLServer({typeDefs, resolvers})

// pornire server
server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port} for requests.`)
})