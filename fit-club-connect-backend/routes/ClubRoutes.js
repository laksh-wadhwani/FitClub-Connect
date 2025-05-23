const express = require("express");
const router = express.Router();


const {SignUpFlow1, SignUpFlow2, VerifyOTP, SignIn, UpdateClubDetails, GetClubDetails, AccountDetails, PaymentAcknowledgement, GetReceiptForProvider, ForgotPassword, UploadVideo, GetWorkoutVideo} = require("../contollers/ClubController");
const upload = require("../middleware/Multer");

router.post("/SignUpFlow1", SignUpFlow1);
router.put("/SignUpFlow2/:email", upload.single("GymProfile"), SignUpFlow2)
router.put("/AccountDetails/:email", AccountDetails)
router.post("/VerifyOTP", VerifyOTP)
router.post("/ForgotPassword/:email", ForgotPassword)
router.post("/SignIn", SignIn)
router.put("/UpdateClubDetails/:id", upload.single("GymProfileUpdated"), UpdateClubDetails)
router.get("/GetClubDetails", GetClubDetails)
router.get("/GetReceiptForProvider/:gymID", GetReceiptForProvider)
router.put("/PaymentAcknowledgement/:transactionID",PaymentAcknowledgement)
router.post("/UploadVideo/:gymID", upload.single("Workout_Video"), UploadVideo)
router.get("/GetWorkoutVideo/:gymID", GetWorkoutVideo)

module.exports = router