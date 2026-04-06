const express = require('express');
const { validate } = require('../middleware/validate');
const schemas = require('../validators/schemas');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(schemas.registerSchema), authController.register);
router.post('/login', validate(schemas.loginSchema), authController.login);
router.get('/logout', authController.logout);

module.exports = router;
