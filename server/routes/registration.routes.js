const express = require('express');
const router = express.Router();
const { RegistrationControllers } = require('../controllers');
const { verifyUser, verifyAdmin } = require('../services/middlewares');

router.post('/register-test/:testid', verifyUser, RegistrationControllers.registerTest);
router.post('/unregister-test/:testid', verifyUser, RegistrationControllers.unregisterTest);
router.post('/get-registrations', verifyUser, RegistrationControllers.getRegistrations);
router.patch('/update-registration/:id', verifyUser, RegistrationControllers.updateRegistration);
router.get('/get-registration-details/:id', verifyUser, RegistrationControllers.getRegistrationDetails);
router.post('/submit-test', verifyUser, RegistrationControllers.submitTest);

module.exports = router;