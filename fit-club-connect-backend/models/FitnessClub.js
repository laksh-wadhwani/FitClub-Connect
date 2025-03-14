const mongoose = require('mongoose')

const fitnesSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNo: String,
    password: String,
    gymName: String,
    cityName: String,
    address: String,
    gymProfile: String,
    gymEmail: String,
    gymPhoneNo: String,
    OTP: String,
    otpExpiry: Date,
    isVerified: {type:Boolean, default:false},
    isAdminVerified: {type:Boolean, default:false},
    accountDetails: [{
        _id: false,
        bankName: {type:String},
        accountTitle: {type: String},
        accountNumber: {type: String}
      }]
});

const fitnessTable = new mongoose.model("fitnessTable", fitnesSchema);

module.exports = fitnessTable;