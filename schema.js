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
var typeDef = `
    type Curs {
        id: Int
        titlu: String
        descriere: String
        autor: String
        platforma: String
    }

    type Auth {
        token: String!
        user: String!
    }

    type Query {
        curs(id: Int!): Curs
        cursuri(titlu: String): [Curs]
    }

    type Mutation {
        updateCursTitlu(id: Int!, titlu: String!): Curs
        adaugaCurs(id: Int!, titlu: String!, descriere: String!, autor: String!, platforma: String!): Curs

        creareToken(user: String!, password: String!): Auth
        verificareToken(token: String!): Auth
    }

    # declararea subscriptie, specificand evenimentul la care se face subscribe
    type Subscription {
        cursAdaugat: Curs!
    }


`;

module.exports = typeDef;