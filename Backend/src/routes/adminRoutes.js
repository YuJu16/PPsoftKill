const express = require("express");
const router = express.Router();
const {validate} = require('../utils/validate');
const {authenticateUser, requireAnyRole} = require('../middlewares/authMiddleware');
const {asyncHandler} = require('../utils/error');
const { GetPendingDealsController, ModerateDealController } = require("../controllers/dealController");
const { ModerateDealValidation, ModerateUsersValidation } = require("../validators/moderationValidation");
const { GetUsersWithPaginationController, ModifyUserRoleController } = require("../controllers/userController");
router.get("/deals/pending",asyncHandler(authenticateUser), requireAnyRole(['admin', 'moderator']),asyncHandler(GetPendingDealsController));
router.patch("/deals/:id/moderate", asyncHandler(authenticateUser), requireAnyRole(['admin', 'moderator']),ModerateDealValidation,validate,asyncHandler(ModerateDealController));



router.get("/users",asyncHandler(authenticateUser),requireAnyRole("admin"), asyncHandler(GetUsersWithPaginationController) );
router.patch("/users/:id/role",asyncHandler(authenticateUser),requireAnyRole("admin"), ModerateUsersValidation, validate, asyncHandler(ModifyUserRoleController));

module.exports = router;