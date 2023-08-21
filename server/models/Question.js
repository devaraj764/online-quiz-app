const mongoose = require('mongoose');

const toInt = (value) => parseInt(value)|| 0

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    options: {
        type: [String],
        default: []
    },
    marksAssigned: {
        type: Number,
        set: toInt
    },
    correctOption: {
        type: Number,
        set: toInt
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    unqNumber: {
        type: Number,
        required: true
    },
    section: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'questions',
    timestamps: true
}
);


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
