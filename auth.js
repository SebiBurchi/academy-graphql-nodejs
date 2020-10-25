const { AuthenticationError } = require('apollo-server-core');
const jwt = require('jsonwebtoken');

const creareToken = (user, password) => {
    try {
        const token = jwt.sign({user: user, password: password}, "supersecret");
        return {token, user}
    } catch(e) {
        throw new AuthenticationError('Authentication token este invalid. Trebuie sa va logati!')
    }
}

const verificareToken = (token) => {
    try {
        const {user} = jwt.verify(token, "supersecret");
        return {token, user};
    } catch(e) {
        throw new AuthenticationError('Authentication token este invalid. Trebuie sa va logati!');
    }
}

module.exports = {creareToken, verificareToken}