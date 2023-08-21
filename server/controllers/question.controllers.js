const Answer = require("../models/Answer");
const Question = require("../models/Question");

const createQuestion = async (req, res) => {
    try {
        const { section, unqNumber, test } = req.body;
        if (!test && !unqNumber) return res.json({ success: false, message: "Invalid Credentials" })
        const data = {
            section, unqNumber, test
        }
        const result = await Question.create(data);
        res.send({ success: true, message: 'Question created successfully', question: result });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const getQuestionsByTestid = async (req, res) => {
    try {
        const { section, test } = req.body;
        if (!test || !section) return res.json({ success: false, message: "Invalid Credentials" })
        var data = {
            section, test
        }
        if (req.role === 'user') data.isDeleted = false;
        const result = await Question.find(data).select('unqNumber status isDeleted marksAssigned');
        if (!result) {
            return res.json({ success: false, message: 'Question not found' });
        }

        res.send({ success: true, message: 'Question created successfully', questions: result });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const findQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.json({ success: false, message: "Invalid Credentials" })
        const result = await Question.findById(id).select(`_id marksAssigned title unqNumber options correctOption isDeleted`);
        if (!result) {
            return res.json({ success: false, message: 'Question not found' });
        }
        var obj = result.toObject();
        if (req.role === 'user') {
            const answer = await Answer.findOne({ question: obj._id, user: req.userId }).select('chooseOption _id answerStatus isMarked');
            obj.answer = answer;
        }
        res.send({ success: true, message: 'Question created successfully', question: obj });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the question by ID
        const question = await Question.findById(id);

        if (!question) {
            return res.json({ success: false, message: 'Question not found' });
        }

        // Delete the question
        question.isDeleted = true;
        await question.save();

        res.status(200).json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        // Find the question by ID
        const question = await Question.findById(id).select('_id');

        if (!question) {
            return res.json({ success: false, message: 'Question not found' });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(id, { $set: { ...data, status: true } });
        res.status(200).json({ success: true, message: 'Question updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { createQuestion, getQuestionsByTestid, deleteQuestion, updateQuestion, findQuestionById }