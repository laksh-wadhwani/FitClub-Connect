const mongoose = require('mongoose')

const packagesSchema = new mongoose.Schema({
    gymID: {type: mongoose.Schema.Types.ObjectId, ref: 'fitnessTable'},
    packageName: String,
    duration: String,
    price: String,
    description: String,
    packageProfile: String,
    isAdminVerified: {type: Boolean, default:false}
});

const packagesTable = new mongoose.model("packagesTable", packagesSchema);

module.exports = packagesTable;