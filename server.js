const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Feedback = require('./Feedback');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Replace with your MongoDB URI if using Atlas
mongoose.connect('mongodb://localhost:27017/feedbackdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
    const { name, email, feedback } = req.body;
    try {
        const newFeedback = new Feedback({ name, email, feedback });
        await newFeedback.save();
        res.send('✅ Feedback saved to MongoDB!');
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Failed to save feedback.');
    }
});

app.get('/feedbacks', async (req, res) => {
    const allFeedback = await Feedback.find({});
    res.json(allFeedback);
});

app.get('/feedback-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'feedback-form.html'));
});

app.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
});
