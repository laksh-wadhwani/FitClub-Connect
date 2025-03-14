const express = require("express");
const router = express.Router();

const { SignUpFlow1, SignUpFlow2, VerifyOTP, ForgotPassword, Login, MakePayment, GetReceiptForConsumer, UpdateUserDetails } = require("../contollers/EnthusiastController");
const { UploadUserProfile, UploadPaymentReceipt } = require("../middleware/Multer");

router.post("/SignUpFlow1", SignUpFlow1)
router.put("/SignUpFlow2/:email", UploadUserProfile.single("UserProfile"), SignUpFlow2)
router.post("/VerifyOTP", VerifyOTP)
router.post("/SignIn", Login)
router.post("/ForgotPassword/:email", ForgotPassword)
router.post("/MakePayment/:userID/:gymID", UploadPaymentReceipt.single("PaymentReceipts"), MakePayment)
router.get("/GetReceiptForConsumer/:userID", GetReceiptForConsumer)
router.put("/UpdateUserDetails/:userID", UploadUserProfile.single("UserProfileUpdated"), UpdateUserDetails)

module.exports = router;