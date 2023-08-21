const Answer = require("../models/Answer");
const Question = require("../models/Question");
const Registration = require("../models/Registration");
const Test = require("../models/Test");

const registerTest = async (req, res, next) => {
    try {
        const { testid } = req.params;
        const data = { test: testid, user: req.userId, ...req.body }
        await Registration.create(data)
        await Test.updateOne({ _id: testid }, { $inc: { registrations: 1 } })
        res.send({ success: true, message: "Test Registered" })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Request failed' });
    }
}

const submitTest = async (req, res) => {
    try {
        const { regid, testid, completedTime } = req.body;
        if (!regid || !testid || !completedTime) return res.send({ success: false, message: 'Invalid Arguments' })
        const answers = await Answer.find({ registration: regid, user: req.userId, answerStatus: 'answered' }).select('chooseOption').populate('question', 'correctOption marksAssigned');
        var correctCount = 0;
        var wrongCount = 0;
        const score = answers.reduce((sum, answer) => {
            if (answer.chooseOption === answer.question.correctOption) {
                correctCount += 1
                return sum += answer.question.marksAssigned
            }
            else {
                wrongCount += 1;
                return sum
            }
        }, 0);
        const totalQuestions = await Question.countDocuments({ test: testid });
        const test = await Test.findOne({ _id: testid }).select('passMark')
        const data = { correctCount, wrongCount, score, totalQuestions, completedTime, status: 'completed', result: test.passMark > score ? 'fail' : 'pass' }
        await Registration.updateOne({ _id: regid }, data)
        res.send({ success: true, message: 'Successfully Submitted' });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Request failed' });
    }
}

const unregisterTest = async (req, res, next) => {
    try {
        const { testid } = req.params;
        const data = { test: testid, user: req.userId }
        await Registration.deleteOne(data)
        await Test.updateOne({ _id: testid }, { $inc: { registrations: -1 } })
        res.send({ success: true, message: "Test UnRegistered" })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Request failed' });
    }
}

const getRegistrations = async (req, res, next) => {
    try {
        const { startTimestamp, endTimestamp } = req.body;
        console.log(startTimestamp, endTimestamp)
        if(!startTimestamp || !endTimestamp) return res.send({success: false, message:"Invaalid Arguments"});
        const data = { user: req.userId }
        const query = Registration.find(data).select('status createdAt _id score completedTime result').populate('test', 'testName testDuration _id startTime endTime totalMarks')
        if (startTimestamp && endTimestamp) {
            query.where('createdAt').gte(startTimestamp).lte(endTimestamp);
        } else {
            query.limit(10);
        }
        const registrations = await query.exec();
        res.send({ success: true, message: "Feteched all registrations", registrations })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Request failed' });
    }
}

const getRegistrationDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await Registration.findOne({ _id: id }).populate('test', 'testName testDuration _id totalMarks sections instructions')
        res.send({ success: true, message: "Feteched all registrations", registration })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Request failed' });
    }
}

const updateRegistration = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        // Find the question by ID
        const question = await Registration.findById(id).select('_id');

        if (!question) {
            return res.json({ success: false, message: 'Registration not found' });
        }

        await Registration.findByIdAndUpdate(id, { $set: data });
        res.status(200).json({ success: true, message: 'Registration updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { registerTest, unregisterTest, getRegistrations, updateRegistration, getRegistrationDetails, submitTest }