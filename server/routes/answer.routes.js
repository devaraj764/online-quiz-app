const express = require('express');
const router = express.Router();
const { AnswerControllers } = require('../controllers');
const { verifyUser, verifyAdmin } = require('../services/middlewares');

router.post('/create-answer', verifyUser, AnswerControllers.createAnswer)
router.post('/get-anwers', verifyUser, AnswerControllers.getQuestionsWithAnswers)
router.patch('/update-answer/:id', verifyUser, AnswerControllers.updateAnswer)

module.exports = router;
