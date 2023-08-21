const { default: mongoose } = require("mongoose");
const Question = require("../models/Question");
const Registration = require("../models/Registration");
const Test = require("../models/Test");

const createTest = async (req, res) => {
    try {
        const { testName, testDuration, totalMarks, sections, passMark } = req.body;

        if (!testName || !testDuration || !totalMarks || !passMark) return res.json({ success: false, message: 'Invalid Credentials' });

        // Create a new test document using the Test model
        const newTest = new Test({
            testName,
            testDuration,
            totalMarks,
            sections,
            passMark,
            user: req.userId
        });

        // Save the test to the database
        const savedTest = await newTest.save();

        res.json({ success: true, data: { _id: savedTest._id } });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const getTests = async (req, res) => {
    try {
        const { startTimestamp, endTimestamp } = req.body;
        if (!startTimestamp || !endTimestamp) return res.send({ success: false, message: "Invaalid Arguments" });
        const query = Test.find({ user: req.userId }).select('_id testName testDuration sections createdAt status startTime endTime').sort({ updatedAt: -1 });
        if (startTimestamp && endTimestamp) {
            query.where('createdAt').gte(startTimestamp).lte(endTimestamp);
        } else {
            query.limit(10);
        }
        const tests = await query.exec();
        res.send({ success: true, message: "Tests retrived", tests })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const getTestById = async (req, res) => {
    try {
        const { testid } = req.params;
        const query = Test.findOne({ _id: testid, user: req.userId });
        const test = await query.exec();
        if (!test) return res.send({ success: false, message: 'Test Not Found' });
        var marksList = await Question.find({ test, isDeleted: false }).select('marksAssigned')
        const questionsCount = marksList.length;
        const marksUsed = await marksList.reduce((sum, question) => {
            if (question.marksAssigned) return sum += question.marksAssigned
            return sum
        }, 0)
        const obj = test.toObject();
        obj.questionsCount = questionsCount;
        obj.marksUsed = marksUsed;
        res.send({ success: true, message: "Test retrived", test: obj })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const getWatchTestDetails = async (req, res) => {
    try {
        const { testid } = req.params;
        console.log(req.userId)
        const query = Test.findOne({ _id: testid });
        const test = await query.exec();
        console.log(test)
        if (!test) return res.send({ success: false, message: 'Test Not Found' });
        const questionsCount = await Question.countDocuments({ test: testid, section: { $ne: null } })
        const isRegistered = await Registration.findOne({ test: testid, user: req.userId });
        const isEditor = await Test.findOne({ _id: testid, user: req.userId }).select('_id');
        const obj = test.toObject();
        obj.questionsCount = questionsCount;
        obj.isRegistered = isRegistered ? true : false;
        obj.isEditor = isEditor ? true : false;
        res.send({ success: true, message: "Test retrived", test: obj })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}


const updateTestById = async (req, res) => {
    try {
        const { testid } = req.params;
        console.log(req.body)
        const query = Test.findOneAndUpdate({ _id: testid, user: req.userId }, {
            $set: req.body
        });
        await query.exec();
        res.send({ success: true, message: "Test updated" })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const publishTest = async (req, res) => {
    try {
        const { testid } = req.params;
        const { startTimestamp, endTimestamp } = req.body;

        if (!startTimestamp || !endTimestamp) return res.send({ success: false, message: 'Include start and end timestamps' })

        const test = await Test.findOne({ _id: testid, user: req.userId });
        if (!test) {
            res.send({ success: false, message: 'Test Not Found' })
        }

        if (test?.testDuration < 0 || test?.testName === '' || test?.totalMarks < 0 || test?.passMark < 0) return res.json({ success: false, message: 'Test Requirements are incomplete.' })
        const questions = await Question.find({ test: testid, status: false, isDeleted: false });
        console.log(questions)
        if (questions.length > 0) return res.send({ success: false, message: 'There are some incomplete questions' });
        test.status = 'published';
        test.startTime = startTimestamp;
        test.endTime = endTimestamp
        await test.save()
        res.send({ success: true, message: "Test published" })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
}

const getScoreBoard = async (req, res) => {
    const { testid } = req.params;
    const { section, timestamp } = req.body;
    try {
        const test = await Test.findOne({ _id: testid }).select('sections passMark totalMarks');
        const query = Registration.find({ test: testid, attempts: { $gt: 0 } }).select('completedTime updatedAt correctCount wrongCount score marks attempts result').populate('user', 'fullName');
        if (section && section !== 'All') {
            query.populate('test', { section })
        }
        const result = await query.exec();
        const registrationsCount = await Registration.countDocuments({ test: testid });
        const passed = await Registration.countDocuments({ test: testid, result: 'pass' });
        res.send({ success: true, message: 'Score Board', scores: result, regCount: registrationsCount, passed, participants: result.length, test })
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({ error: 'Request failed' });
    }
}

module.exports = { createTest, getTests, getTestById, updateTestById, publishTest, getWatchTestDetails, getScoreBoard }