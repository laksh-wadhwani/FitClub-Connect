const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref:'userTable'},
    gymID: {type: mongoose.Schema.Types.ObjectId, ref:'fitnessTable'},
    packageDetails: [{
        packageID: {type: mongoose.Schema.Types.ObjectId, ref: "packagesTable"},
        dateOfPurchase: {type: Date, default: Date.now()},
        validTill: {type: Date, default: Date.now()}
    }],
    payment_receipt: {type: String},
    isProviderAcknowledged: {type: Boolean, default:false}
})

const transaction = new mongoose.model("transaction", transactionSchema);

module.exports = transaction;