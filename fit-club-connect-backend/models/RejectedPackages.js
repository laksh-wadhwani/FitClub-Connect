const mongoose = require("mongoose");

const RejectedPackageSchema = new mongoose.Schema({
    adminID: {type: mongoose.Schema.Types.ObjectId, ref:"AdminTable"},
    gymID: {type: mongoose.Schema.Types.ObjectId, ref:"fitnessTable"},
    packageID: {type: mongoose.Schema.Types.ObjectId, ref:"packagesTable"},
    packageName: {type: mongoose.Schema.Types.String, ref:"packagesTable"},
    packageProfile: {type: mongoose.Schema.Types.String, ref:"packagesTable"},
    adminRemarks: String
});

const RejectedPackages = mongoose.model("RejectedPackage", RejectedPackageSchema)

module.exports = RejectedPackages