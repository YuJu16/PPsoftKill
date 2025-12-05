const express =require('express');
const router = express.Router();
const {registerController, loginController, profileController}  = require('../controllers/AuthController');
const { createUserValidation, loginValidation } = require('../validators/AuthValidation');
const { validate } = require('../utils/validate');
const {authenticateUser} = require('../middlewares/authMiddleware');
const {asyncHandler} = require('../utils/error');

router.post('/register',createUserValidation,validate, asyncHandler(registerController),  );
router.post('/login',loginValidation,validate, asyncHandler(loginController));
router.get('/me',asyncHandler(authenticateUser),asyncHandler(profileController));

module.exports = router;

