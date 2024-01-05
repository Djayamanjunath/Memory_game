
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/memorygame', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Game result schema
const gameResultSchema = new mongoose.Schema({
    score: Number,
    steps: Number,
    time: Number,
    date: { type: Date, default: Date.now }
});

const GameResult = mongoose.model('GameResult', gameResultSchema);

// Middleware
app.use(bodyParser.json());

// Handle CORS (Cross-Origin Resource Sharing) to allow requests from your front-end
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Save game result to MongoDB
app.post('/api/game-results', async (req, res) => {
    const { score, steps, time } = req.body;

    try {
        // Create a new document
        const newGameResultDocument = new GameResult({
            score: score,
            steps: steps,
            time: time,
        });

        // Save the document to the collection using save
        const savedResult = await newGameResultDocument.save();
        console.log('Saved game result with id:', savedResult._id);

        // Include ObjectId in the response
        res.status(201).json({ id: savedResult._id, score: score, steps: steps, time: time });
    } catch (error) {
        console.error('Error saving game result to database:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
