const { PubSub } = require('graphql-subscriptions');
const { creareToken, verificareToken } = require('./auth');

// setam o instanta de PubSub
const pubSub = new PubSub();

// declarare topic
const CURS_ADAUGAT_TOPIC = 'cursNou';

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

var cursuriNewData = [];
var cursNewId = 1;

// definire resolver
const resolvers = {
    Subscription: {
        cursAdaugat: {
            subscribe(parent, args, ctx, info) {
                return pubSub.asyncIterator(CURS_ADAUGAT_TOPIC);
            }
        }
    },


    Query: {
        curs: (parent, args, context) => {
            const { token } = context;
            const _ = verificareToken(token);
            return cursuriData.filter(curs => {
                return curs.id == args.id;
            })[0];
        },

        cursuri: (parent, args, context) => {
            if (args.titlu) {
                var titlu = args.titlu;
                return cursuriData.filter(curs => curs.titlu === titlu);
            } else {
                return cursuriData;
            }
        },

        cursuriNoi: (parent, args, context) => {
            return cursuriNewData;
        }
    },

    Mutation: {
        updateCursTitlu:(parent, args, context, info) => {
            const { token } = context;
            const _ = verificareToken(token);
            cursuriData.map(curs => {
                if (curs.id === args.id) {
                    curs.titlu = args.titlu;
                    return curs;
                }
            })
            return cursuriData.filter(curs => curs.id === args.id)[0];
        },

        adaugaCurs: (parent, args, ctx, info) => {
            const curs = {
                id: args.id,
                titlu: args.titlu,
                autor: args.autor,
                descriere: args.descriere,
                platforma: args.platforma
            }

            cursuriData.push(curs);
            pubSub.publish(CURS_ADAUGAT_TOPIC, { cursAdaugat: curs})

            return cursuriData.filter(curs => curs.id === args.id)[0];
        },

        creareToken: (parent, args, context) => {
            const {user, password} = args;
            return creareToken(user, password);
        },

        verificareToken: (parent, args, context) => {
            const { token } = args;
            return verificareToken(token);
        },

        creareCursProgramare: (parent, args, context, info) => {
            const cursNou = {
                id: cursNewId++,
                titlu: args.input.titlu,
                limbaj: args.input.limbaj
            };

            cursuriNewData.push(cursNou);

            return cursNou;
        }
    },

    CursInterfata: {
        __resolveType(cursInterfata, context, info) {
            if(cursInterfata.limbaj) {
                return 'CursProgramare';
            }

            if(cursInterfata.balanta) {
                return 'CursContabilitate';
            }

            return null;
        },
    }
}

module.exports = resolvers;