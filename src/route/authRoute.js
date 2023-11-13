const express = require('express');
const {
    createUser, 
    loginUserCtrl, 
    getallUser, 
    getaUser, 
    deleteaUser, 
    UpdateaUser, 
    blockUser, 
    unblockUser, 
    handleRefreshToken, 
    logout, 
    updatePassword, 
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    saveAddress
} = require('../controller/authController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.post('/register', asyncHandler(createUser));
router.post("/forgot-password-token", asyncHandler(forgotPasswordToken));
router.put("/reset-password/:token", asyncHandler(resetPassword));
router.put('/password', authMiddleware, asyncHandler(updatePassword));
router.post('/login', asyncHandler(loginUserCtrl));
router.post("/admin-login", asyncHandler(loginAdmin));
router.get('/all-users', asyncHandler(getallUser));

router.get('/refresh', asyncHandler(handleRefreshToken));
router.get('/logout', asyncHandler(logout));

router.get('/:id', authMiddleware, asyncHandler(getaUser));

router.delete('/:id', authMiddleware , isAdmin, asyncHandler(deleteaUser));
router.put('/edit-user', authMiddleware, asyncHandler(UpdateaUser));
router.put("/save-address", authMiddleware, asyncHandler(saveAddress));
router.put('/block-user/:id', authMiddleware, isAdmin, asyncHandler(blockUser));
router.put('/unblock-user/:id', authMiddleware, isAdmin, asyncHandler(unblockUser));

module.exports = router;