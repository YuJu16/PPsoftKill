const express =require('express');
const { GetPostsController, SearchPostsController,GetPostByIdController,AddPostController,ModifyPostByIdController,DeletePostByIdController } = require('../controllers/postController');
const {authenticateUser, optionalAuthenticate} = require("../middlewares/authMiddleware");
const {CreatePostValidation,SearchPostValidation, ModifyPostValidation} = require('../validators/postValidation');
const { validate } = require('../utils/validate');
const router = express.Router();
const {VoteValidation} = require('../validators/voteValidation');
const {VoteController, RemoveVote}= require('../controllers/voteController');
const {asyncHandler} = require('../utils/error');
const { GetCommentsController, AddCommentController} = require('../controllers/commentController');
const { CommentValidation } = require('../validators/commentValidation');
const upload = require('../middlewares/uploadMiddleware');

//Post routes
router.get("/", asyncHandler(optionalAuthenticate),asyncHandler(GetPostsController));
router.get("/search",SearchPostValidation,validate,asyncHandler(SearchPostsController));
router.get("/:id", asyncHandler(authenticateUser), asyncHandler(GetPostByIdController));
router.post("/",CreatePostValidation,validate,asyncHandler(authenticateUser), upload.single('image'), asyncHandler(AddPostController));
router.put("/:id",ModifyPostValidation,validate,asyncHandler(authenticateUser), upload.single('image'), asyncHandler(ModifyPostByIdController));
router.delete("/:id", asyncHandler(authenticateUser), asyncHandler(DeletePostByIdController));


//Vote routes
router.post("/:id/vote",VoteValidation,validate, asyncHandler(authenticateUser),asyncHandler(VoteController));
router.delete("/:id/vote", asyncHandler(authenticateUser),asyncHandler(RemoveVote));


//Comment routes

router.get("/:postId/comments",asyncHandler(GetCommentsController));
router.post("/:postId/comments",CommentValidation, validate, asyncHandler(authenticateUser), asyncHandler(AddCommentController));


module.exports = router;

