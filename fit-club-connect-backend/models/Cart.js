const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'userTable'},
    gymID : {type: mongoose.Schema.Types.ObjectId, ref: 'fitnessTable'},
    packageDetails: [{
        packageID: {type:mongoose.Schema.Types.ObjectId, ref:'packagesTable'},
        isApproval: {type:Boolean, default:false}
    }]
})
const cartTable = new mongoose.model("cartTable", cartSchema);

module.exports = cartTable;