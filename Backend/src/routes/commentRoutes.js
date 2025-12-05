const express = require("express");
const router = express.Router();
const {asyncHandler} = require('../utils/error');
const {validate} = require('../utils/validate');
const {authenticateUser} = require('../middlewares/authMiddleware');
const {ModifyCommentController,DeleteCommentController} =require('../controllers/commentController');
const {CommentValidation} = require('../validators/commentValidation');

router.put("/:id", CommentValidation, validate, asyncHandler(authenticateUser), asyncHandler(ModifyCommentController));
router.delete("/:id",asyncHandler(authenticateUser), asyncHandler(DeleteCommentController));


module.exports  = router;