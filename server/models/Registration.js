const mongoose = require('mongoose');

const toInt = (value) => parseInt(value)|| 0

// Define the Registration Schema
const registrationSchema = new mongoose.Schema({
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
        unique: true
    },
    status: { type: String, default: 'registered', enum: ['registered', 'pending', 'completed'] },
    score: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0, toInt },
    wrongCount: { type: Number, default: 0, toInt },
    totalQuestions: { type: Number, default: 0, toInt },
    countDown: { type: Number, toInt },
    attempts: { type: Number, default: 0, set: toInt },
    tabSwitches: { type: Number, default: 0, set: toInt },
    completedTime: { type: Number, default: 0, toInt },
    result: { type: 'String', enum: ['pass', 'fail'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    collection: 'registrations',
    timestamps: true
});

// Create the Registration Model
const Registration = mongoose.model('Registration', registrationSchema);

// Export the model
module.exports = Registration;
