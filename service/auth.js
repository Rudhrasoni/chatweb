const session = new Map();

function setUser(id, user) {
    session.set(id, user);
}

function getUser(id) {
    session.get(id);
}

module.exports = {
    setUser,
    getUser
}