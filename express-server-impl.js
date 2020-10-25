/*
    server utilizand express-graphql
*/

// initializare Express server
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')


// creare GraphQL schema
/*
    schema intiala contine un tip custom Curs si 2 actiuni de tip interogare

    tipul Curs contine mai multe campuri

    cele 2 actiuni de interogarea returneaza un curs, respectiv o lista de cursuri

    pentru prima actiune, parametrul este obligatoriu (!), iar pentru a doua optiune este optional

*/

/*
    adaugam tipul de mutatie in schema

    mutatia contine 2 parametri de tip int si string

    utilizand mutatia vom putea sa facem update titlului unui curs, dupa id

    mutati returneaza obiectul modificat
*/
var schema = buildSchema (`
    type Curs {
        id: Int
        titlu: String
        descriere: String
        autor: String
        platforma: String
    }

    type Query {
        curs(id: Int!): Curs
        cursuri(titlu: String): [Curs]
    }

    type Mutation {
        updateCursTitlu(id: Int!, titlu: String!): Curs
    }

`)

// hardcodare date pentru evitarea bazei de date
var cursuriData = [
    {
        id: 1,
        titlu: "Golang",
        autor: "Sebi Burchi",
        descriere: "Invata Golang in cativa pasi",
        platforma: "Telecom Academy"

    },
    {   
        id: 2,
        titlu: "Continuous Integration",
        autor: "Sebi Burchi",
        descriere: "Invat un flow de CI de la 0",
        platforma: "Telecom Academy"
    },
    {
        id: 3,
        titlu: "GraphQL",
        autor: "Sebi Burchi",
        descriere: "Noul REST",
        platforma: "Telecom Academy"

    }
]

// definire resolver
var obtineCurs = function(args) {
    var id = args.id;
    return cursuriData.filter(curs => {
        return curs.id == id;
    })[0];
}

var obtineCursuri = function(args) {
    if (args.titlu) {
        var titlu = args.titlu;
        return cursuriData.filter(curs => curs.titlu == titlu);
    } else {
        return cursuriData;
    }
}

var updateCurs = function({id, titlu}) {
    cursuriData.map(curs => {
        if (curs.id === id) {
            curs.titlu = titlu;
            return curs; 
        }
    })
    return cursuriData.filter(curs => curs.id === id)[0];
}


var root = {
    curs: obtineCurs,
    cursuri: obtineCursuri,
    updateCursTitlu: updateCurs
}

const server = express()

// adaugare express-graphql ca si middleware - adaugam o singura
server.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql:true
}))

// startare server GraphQL
server.listen(3000, () => {
    console.log('Server listening on port 3000')
})