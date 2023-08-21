// Import Mongoose
const mongoose = require('mongoose');
const toInt = (value) => parseInt(value)|| 0


// Define the Answer Schema
const answerSchema = new mongoose.Schema({
    registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
    chooseOption: { type: Number, set: toInt },
    answerStatus: { type: String, default: 'not-answered', enum: ['not-answered', 'answered'] },
    isMarked: { type: Boolean, default: false },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
}, {
    collection: 'answers',
    timestamps: true
});

// Create the Answer Model
const Answer = mongoose.model('Answer', answerSchema);

// Export the model
module.exports = Answer;
