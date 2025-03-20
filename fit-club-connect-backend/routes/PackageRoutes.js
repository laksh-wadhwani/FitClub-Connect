const express = require('express');
const router = express.Router();

const {UploadPackage, UpdatePackageDetails, GetPackageDetails, DeletePackage} = require("../contollers/PackageController");
const upload = require('../middleware/Multer');

router.post("/UploadPackage", upload.single("PackageProfile"), UploadPackage)
router.get("/GetPackageDetails/:id", GetPackageDetails)
router.put("/UpdatePackageDetails/:id", upload.single("UpdatedPackageProfile"), UpdatePackageDetails)
router.delete("/DeletePackage/:id", DeletePackage)

module.exports = router