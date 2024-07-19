const users = [];

const addUser = ({ id, username, password }) => {
    const user = { id, username, password };
    users.push(user);
    return user;
};

const getUser = (username) => users.find(user => user.username === username);

module.exports = { addUser, getUser };
