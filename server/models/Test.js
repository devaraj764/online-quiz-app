const mongoose = require('mongoose');

const toInt = (value) => parseInt(value) || 0;

const testSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: true,
        unique: true
    },
    testDuration: {
        type: Number,
        required: true,
        set: toInt
    },
    totalMarks: {
        type: Number,
        required: true,
        set: toInt
    },
    passMark: {
        type: Number,
        set: toInt
    },
    instructions: {
        type: String,
    },
    status: {
        type: String,
        enum: ['unpublished', 'published', 'completed'],
        default: 'unpublished',
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    sections: {
        type: [String],
    },
    registrations: {
        type: Number,
        default: 0,
    },
    participants: {
        type: Number,
        default: 0,
        set: toInt
    },
    passed: {
        type: Number,
        default: 0,
        set: toInt
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    collection: 'tests',
    timestamps: true
}

);

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
