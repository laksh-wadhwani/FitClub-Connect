const mongoose = require("mongoose");

const RejectedClubSchema = new mongoose.Schema({
    adminID: {type: mongoose.Schema.Types.ObjectId, ref:'AdminTable'},
    gymID: {type: mongoose.Schema.Types.ObjectId, ref:'fitnessTable'},
    gymName: {type: mongoose.Schema.Types.String, ref:'fitnessTable'},
    gymProfile: {type: mongoose.Schema.Types.String, ref:'fitnessTable'},
    adminRemarks: String
})

const RejectedClubTable = mongoose.model("RejectedClubTable", RejectedClubSchema)

module.exports = RejectedClubTable