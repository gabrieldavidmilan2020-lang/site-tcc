const users = {};

module.exports = {
    getUserByUsername: (username) => {
        return users[username] || null;
    },

    createUser: (username, password) => {
        if (users[username]) return false;

        users[username] = {
    username,
    password,   // sem hash por enquanto
    faseAtual: 1,
    pontos: 0
};
        return true;
    },

    saveProgress: (username, faseAtual, pontos) => {
        if (!users[username]) return false;

        users[username].faseAtual = faseAtual;
        users[username].pontos = pontos;

        return true;
    },

    updateProgress: (username, faseAtual, pontos) => {
        return module.exports.saveProgress(username, faseAtual, pontos);
    },

    getProgress: (username) => {
        return users[username] || { faseAtual: 1, pontos: 0 };
    }
};