const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const http = require('http')

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: () => console.log('Connected to websocket')
    },
    context: ({req, connection}) => {
        if (connection) {
            return connection.context;
        } else {
            const token = req.headers.authorization || '';

            return {token};
        }
    },
});

const app = express();
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT = 5000, () => {
    console.log(`Server is ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})