const Feedback = require('../models/feedback');

const submitFeedback = async (req, res) => {
    try {
        const { userId, message } = req.body;
        const feedback = new Feedback({ userId, message });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = { submitFeedback };
