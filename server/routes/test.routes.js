const express = require('express');
const router = express.Router();
const { TestControllers } = require('../controllers');
const { verifyUser, verifyAdmin } = require('../services/middlewares');

router.post('/create', verifyAdmin, TestControllers.createTest);
router.post('/get-tests', verifyUser, TestControllers.getTests);
router.get('/get-test-details/:testid', verifyUser, TestControllers.getTestById);
router.get('/get-test-watch/:testid', verifyUser, TestControllers.getWatchTestDetails);
router.patch('/update-test/:testid', verifyUser, TestControllers.updateTestById);
router.patch('/publish-test/:testid', verifyAdmin, TestControllers.publishTest);
router.get('/get-score-board/:testid', verifyAdmin, TestControllers.getScoreBoard);


module.exports = router;