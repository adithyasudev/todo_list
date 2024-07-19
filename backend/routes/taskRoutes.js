const express = require('express');
const router = express.Router();

let tasks = [];

router.get('/', (req, res) => {
    res.json(tasks);
});

router.post('/', (req, res) => {
    const task = { id: Date.now(), ...req.body };
    tasks.push(task);
    res.status(201).json(task);
});

router.put('/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex > -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

router.delete('/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(204).send();
});

module.exports = router;
