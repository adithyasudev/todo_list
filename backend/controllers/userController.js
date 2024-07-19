const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { addUser, getUser } = require('../models/userModel');

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    const existingUser = getUser(username);
    if (existingUser) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = addUser({ id: Date.now().toString(), username, password: hashedPassword });

    res.status(201).send(user);
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = getUser(username);
    if (!user) return res.status(400).send('Invalid credentials');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user.id }, 'secret');
    res.header('Authorization', token).send({ token });
};

module.exports = { registerUser, loginUser };
