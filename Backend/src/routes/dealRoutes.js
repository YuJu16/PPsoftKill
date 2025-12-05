const express =require('express');
const { GetDealsController, SearchDealsController,GetDealByIdController,AddDealController,ModifyDealByIdController,DeleteDealByIdController } = require('../controllers/dealController');
const {authenticateUser, optionalAuthenticate} = require("../middlewares/authMiddleware");
const {CreateDealValidation,SearchDealValidation, ModifyDealValidation} = require('../validators/dealValidation');
const { validate } = require('../utils/validate');
const router = express.Router();
const {VoteValidation} = require('../validators/voteValidation');
const {VoteController, RemoveVote}= require('../controllers/voteController');
const {asyncHandler} = require('../utils/error');
const { GetCommentsController, AddCommentController} = require('../controllers/commentController');
const { CommentValidation } = require('../validators/commentValidation');

//Deal routes
router.get("/", asyncHandler(optionalAuthenticate),asyncHandler(GetDealsController));
router.get("/search",SearchDealValidation,validate,asyncHandler(SearchDealsController));
router.get("/:id", asyncHandler(authenticateUser), asyncHandler(GetDealByIdController));
router.post("/",CreateDealValidation,validate,asyncHandler(authenticateUser),  asyncHandler(AddDealController));
router.put("/:id",ModifyDealValidation,validate,authenticateUser, ModifyDealByIdController);
router.delete("/:id", asyncHandler(authenticateUser), asyncHandler(DeleteDealByIdController));


//Vote routes
router.post("/:id/vote",VoteValidation,validate, asyncHandler(authenticateUser),asyncHandler(VoteController));
router.delete("/:id/vote", asyncHandler(authenticateUser),asyncHandler(RemoveVote));


//Comment routes

router.get("/:dealId/comments",asyncHandler(GetCommentsController));
router.post("/:dealId/comments",CommentValidation, validate, asyncHandler(authenticateUser), asyncHandler(AddCommentController));


module.exports = router;