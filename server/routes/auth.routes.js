const express = require('express');
const router = express.Router();
const { AuthControllers } = require('../controllers');

router.post('/signup', AuthControllers.signUpUser);
router.post('/login', AuthControllers.loginUser);

module.exports = router;
