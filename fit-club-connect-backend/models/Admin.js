const mongoose = require("mongoose")

const AdminSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNo: Number,
    password: String,
    adminProfile: String,
    OTP: String,
    otpExpiry: Date,
    isVerified: {type: Boolean, default:false}
})

const AdminTable = mongoose.model("AdminTable", AdminSchema)

module.exports = AdminTable