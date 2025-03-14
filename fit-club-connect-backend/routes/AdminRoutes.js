const express = require("express");
const router = express.Router();

const {
  SignUp,
  VerifyOTP,
  SignIn,
  GetClubDetailsForApproval,
  ClubApproval,
  ClubRejection,
  GetOverallClubDetails,
  GetPackageDetailsForApproval,
  PackageApproval,
  PackageRejection,
  GetOverallPackageDetails,
  ForgotPassword
} = require("../contollers/AdminController");
const { UploadAdminProfile } = require("../middleware/Multer");

router.post("/SignUp", UploadAdminProfile.single("AdminProfile"), SignUp);
router.post("/VerifyOTP", VerifyOTP);
router.post("/SignIn", SignIn);
router.post("/ForgotPassword/:email", ForgotPassword)

// Club Approvals and Rejctions
router.get("/GetClubDetailsForApproval", GetClubDetailsForApproval);
router.put("/ClubApproval/:clubID", ClubApproval);
router.post("/ClubRejection/:gymID/:adminID", ClubRejection);
router.get("/GetOverallClubDetails", GetOverallClubDetails);

//Packages Approvals and Rejections
router.get("/GetPackageDetailsForApproval", GetPackageDetailsForApproval);
router.put("/PackageApproval/:packageID", PackageApproval);
router.post("/PackageRejection/:packageID/:adminID", PackageRejection)
router.get("/GetOverallPackageDetails", GetOverallPackageDetails)

module.exports = router;
