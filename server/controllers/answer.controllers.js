const Answer = require("../models/Answer");
const Question = require("../models/Question");

const createAnswer = async (req, res) => {
    try {
        const { questionid, regid } = req.body;
        if (!questionid || !regid) res.send({ success: false, message: 'Invalid data' })
        const data = { question: questionid, user: req.userId, registration: regid }
        const isAnswer = await Answer.findOne(data)
        if (isAnswer) return res.send({ success: false, message: 'Answer Already exists' })
        const result = await Answer.create(data);
        res.send({ success: true, message: 'Answer created successfully', question: result });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const getQuestionsWithAnswers = async (req, res) => {
    try {
        const { testid, section, regid } = req.body;
        if (!testid || !section || !regid) return res.send({ success: false, message: 'Invalid input data' })
        const questions = await Question.find({ test: testid, section, isDeleted: { $ne: true } }).select('unqNumber _id').lean().exec();

        for (const question of questions) {
            const answer = await Answer.findOne({
                question: question._id,
                user: req.userId,
                registration: regid,
            }).lean().exec();

            question.answer = answer || null;
        }

        res.send({ success: true, message: 'Questions found', questions: questions });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const updateAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) res.send({ success: false, message: 'Invalid data' });
        const answer = await Answer.findById(id);
        if (!answer) return res.send({ success: false, message: 'Answer not found' })
        await Answer.updateOne({ _id: id }, req.body)
        res.send({ success: true, message: 'Updated Answer' });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

module.exports = { createAnswer, getQuestionsWithAnswers, updateAnswer }