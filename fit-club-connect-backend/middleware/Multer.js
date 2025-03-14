const multer = require("multer");
const path = require("path");

const clubStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,"./uploads/Club") },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.gymName+path.extname(file.originalname)) }
});
const UploadGymProfile = multer({storage:clubStorage})

const packageStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/ClubPackages') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.gymID+"_"+request.body.packageName+path.extname(file.originalname)) }
});
const UploadPackageProfile = multer({storage:packageStorage})

const adminStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/Admin') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.firstName+"_Admin_"+path.extname(file.originalname)) }
});
const UploadAdminProfile = multer({storage:adminStorage})

const userStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/Enthusiasts') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.firstName+path.extname(file.originalname)) }
});
const UploadUserProfile = multer({storage:userStorage})

const receiptStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/PaymentReceipts') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.firstName+path.extname(file.originalname)) }
});
const UploadPaymentReceipt = multer({storage:receiptStorage})

const workoutVideoStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/workoutVideos') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.gymName+"_"+request.body.video_name+path.extname(file.originalname)) }
});
const UploadWorkoutVideo = multer({storage:workoutVideoStorage})

module.exports = {UploadGymProfile, UploadPackageProfile, UploadAdminProfile, UploadUserProfile,UploadPaymentReceipt, UploadWorkoutVideo}