const express = require('express');
const router = express.Router();
const { QuestionControllers } = require('../controllers');
const { verifyUser, verifyAdmin } = require('../services/middlewares');

router.post('/create-question', verifyAdmin, QuestionControllers.createQuestion)
router.get('/get-question/:id', verifyUser, QuestionControllers.findQuestionById)
router.post('/get-questions', verifyUser, QuestionControllers.getQuestionsByTestid)
router.delete('/delete-question/:id', verifyAdmin, QuestionControllers.deleteQuestion)
router.post('/update-question/:id', verifyAdmin, QuestionControllers.updateQuestion)

module.exports = router;