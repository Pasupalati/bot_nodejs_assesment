const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const { connectToDatabase } = require('./config/dbConfig');
require('./config/passpostConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3434;

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/todos', passport.authenticate('jwt', { session: false }), todoRoutes);

// Start server after database connection
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
});
