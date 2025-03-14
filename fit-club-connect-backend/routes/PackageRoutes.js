const express = require('express');
const router = express.Router();

const {UploadPackage, UpdatePackageDetails, GetPackageDetails, DeletePackage} = require("../contollers/PackageController");
const {UploadPackageProfile} = require("../middleware/Multer")

router.post("/UploadPackage", UploadPackageProfile.single("PackageProfile"), UploadPackage)
router.get("/GetPackageDetails/:id", GetPackageDetails)
router.put("/UpdatePackageDetails/:id", UploadPackageProfile.single("UpdatedPackageProfile"), UpdatePackageDetails)
router.delete("/DeletePackage/:id", DeletePackage)

module.exports = router