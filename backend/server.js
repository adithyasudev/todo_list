const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/users', userRoutes);
app.use('/api/tasks', verifyToken, taskRoutes);

let tasks = [];

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('initialTasks', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        io.emit('updateTasks', tasks);
    });

    socket.on('updateTask', (updatedTask) => {
        tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
        io.emit('updateTasks', tasks);
    });

    socket.on('deleteTask', (taskId) => {
        tasks = tasks.filter(task => task.id !== taskId);
        io.emit('updateTasks', tasks);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
