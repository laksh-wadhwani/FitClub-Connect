const GenerateOTP = require("../middleware/OTP")
const transporter = require("../middleware/Mail")
const cloudinary = require("../utils/cloudinary")
const fitnessTable = require("../models/FitnessClub");
const transaction = require("../models/Transaction");
const userTable = require("../models/FitnessEnthusiasts");
const packagesTable = require("../models/Packages");
const WorkoutVideo = require("../models/WorkoutVideo");

const SignUpFlow1 = async(request, response) => {
        const {email} = request.body;
        const OTP = GenerateOTP();
        console.log(`OTP for ${email} is ${OTP}`)
        const otpExpiry = new Date(Date.now()+1*60*1000);
        const newFitnessUser = new fitnessTable({email, OTP, otpExpiry})
        const userCheck = await fitnessTable.findOne({email})

        try{
            if(!userCheck){
                const otpExpiryInMinutes = Math.ceil((otpExpiry - Date.now()) / (1000 * 60));
                const mailOptions = {
                    from: process.env.SMTP_MAIL,
                    to: email,
                    subject: "Secure Your Fit Club Connect Account - Your One-Time Password (OTP) Details Inside",
                    text: `Dear Sir/Ma'am,\nWe hope this message finds you well. To ensure the security of your Fit Club Connect account, we have implemented an additional layer of protection through One-Time Password (OTP) authentication.\nYour OTP Details:\nOTP: ${OTP}\nValidity: ${otpExpiryInMinutes} minutes\nPlease use the provided OTP to verify and access your Fit Club Connect account securely. If you did not request this OTP or suspect any unauthorized activity, please contact our support team immediately.\nThank you for choosing Fit Club Connect for your fitness journey. Stay active and stay secure!\nBest regards,\nFit Club Connect Team`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) console.log("Error in sending OTP: ", error);
                    else console.log("OTP sent successfully");
                });
                await newFitnessUser.save();
                response.send({message:"Please Enter OTP to get registered"});
                if(fitnessTable.isVerified){
                    setTimeout(async () => {
                        await fitnessTable.findOneAndDelete({ email });
                        console.log("User deleted due to OTP expiration")
                    }, otpExpiry - Date.now());
                }
            }
            else return response.send({message:"User Already Exist"})
        }

        catch(error){
            console.log(error)
            return response.send({message:"Internal Server Error"})
        }
};

const SignUpFlow2 = async(request, response) => {
    const {email} = request.params;
    const gymProfile = cloudinary.uploader.upload(request.file?.path)
    const {firstName, lastName, phoneNo, password, gymName, cityName, address, gymEmail, gymPhoneNo} = request.body;
    const lowerCaseCityName = cityName.toLowerCase();
    const userCheck = await fitnessTable.findOne({email})
    try{
        if(userCheck){
            if(firstName) userCheck.firstName=firstName;
            if(lastName) userCheck.lastName=lastName;
            if(phoneNo) userCheck.phoneNo=phoneNo;
            if(password) userCheck.password=password;
            if(gymName) userCheck.gymName=gymName;
            if(cityName) userCheck.cityName=lowerCaseCityName;
            if(address) userCheck.address=address;
            if(gymProfile) userCheck.gymProfile= (await gymProfile).secure_url;
            if(gymEmail) userCheck.gymEmail = gymEmail;
            if(gymPhoneNo) userCheck.gymPhoneNo = gymPhoneNo;
            await userCheck.save();
            return response.send({message:"Fitness Club has been registerd us successfully"+"\nPlease Enter Account Details now"})
        }
        else return response.send({message:"This Email is not exist"})
    }
    catch(error){
        return response.send({message: "Internal Server Error"})
    }
};

const AccountDetails = async(request, response) => {
    const { email } = request.params;
    const  {accounts}  = request.body;
    const club_check = await fitnessTable.findOne({email})
    try{
      if(club_check){
        club_check.accountDetails = accounts;
        await club_check.save();
        return response.send({message: "Your all details has been saved"+"\nWait for Admin approval now"})
      }
      return response.send({message: "User Not Found"})
    }
    catch(error){
      response.send({message: "Internal Server Error"})
      console.log(error)
    }
  }

const VerifyOTP = async(request, response) => {
    try{
        const {finalOTP, email} = request.body;
        const userCheck = await fitnessTable.findOne({email});

        if(userCheck){
            if(userCheck.OTP===finalOTP){
                userCheck.OTP=null;
                userCheck.otpExpiry=null;
                userCheck.isVerified=true;
                await userCheck.save();
                response.send({message: "User has been registered successfully"});
            }

            else{
                await fitnessTable.findOneAndDelete({email});
                response.send({message: "You Entered Wrong OTP"});
            }
        }
        else response.send({message: "User Not Found"});
    }
    catch(error){
        console.log(error);
        response.send({message: "Error verifying OTP"});
    }
};

const SignIn = async(request, response) => {
    try{
        const {email, password} = request.body;
        const user = await fitnessTable.findOne({email});

        if(!user) return response.send({message:"You are not registered"});
        if(user.password===password) return response.send({message:"Login Successful", user:user});
        if(user.password!==password) return response.send({message:"Invalid Password"});
    }
    catch(error){
        console.log(error);
        response.send({message:"Internal Server Error"});
    };
};

const ForgotPassword = async(request, response) => {
    try{
        const { email } = request.params;
        const userCheck = await fitnessTable.findOne({email})
        if(userCheck){
            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: email,
                subject: "Reset Your Password for FitClub Connect",
                text: `Hi ${userCheck.firstName} \nYour Password: ${userCheck.password}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) console.log("Error in sending OTP: ", error);
                else console.log("Forgot Password Sent Successfully",userCheck.password);
            });
            response.send({message: "Your Password has been sent at your mail successfully"})
        }
        else return response.send({message: "Email Not Found"})
    }
    catch(error) {
        console.log(error)
        response.send({message: "Internal Server Error"})
    }
}

const UpdateClubDetails = async(request, response) => {
    try {
        
        const gymID = request.params.id;
        const {firstName, lastName, email, phoneNo, currentPass, newPass, gymName, cityName, address} = request.body;
        const gymProfileUpdated = cloudinary.uploader.upload(request.file?.path)
        const lowerCaseCityName = cityName.toLowerCase();
        const basicInfo = await fitnessTable.findById(gymID);

        if(basicInfo){
            const isPasswordValid = await basicInfo.password===currentPass;
            if(firstName) basicInfo.firstName = firstName;
            if(lastName) basicInfo.lastName = lastName;
            if(email) basicInfo.email = email;
            if(phoneNo) basicInfo.phoneNo = phoneNo;
            if(gymName) basicInfo.gymName = gymName;
            if(cityName) basicInfo.cityName = lowerCaseCityName;
            if(address) basicInfo.address = address;
            if(gymProfileUpdated) basicInfo.gymProfile = (await gymProfileUpdated).secure_url;
            if(currentPass){
                 if(!isPasswordValid) return response.send({message: "Incorrect current password. Please try again."});
                 if(newPass) basicInfo.password = newPass;
            }

            await basicInfo.save();
            response.send({message:"Basic Info has been Updated Successfully", user:basicInfo});
        }
        else return response.send({message: "Invalid User"});
    } 
    catch (error) {
        console.error(error);
        return response.send({ message: "Error in Updating Fitness User Basic Info" });
    }
};

const GetClubDetails = (request, response) => {
    fitnessTable.find()
    .then(data => {
        const isAdminVerified = data.filter(club => club.isAdminVerified===true)
        response.send(isAdminVerified)
    })
}

const GetReceiptForProvider = async(request, response) => {
    const {gymID} = request.params;
    try{
      const receiptCheck = await transaction.find({gymID, isProviderAcknowledged:false}).populate('packageDetails.packageID userID')
      return response.send(receiptCheck)
    }
    catch(error){
      console.log(error)
      return response.send({message: "Internal Server Error"})
    }
  };

  const PaymentAcknowledgement = async(request, response) => {
    const {transactionID} = request.params;
    const receipt_check = await transaction.findById(transactionID)
    const {userID, packageDetails} = receipt_check;
    const user_check = await userTable.findById(userID)
    const {email, firstName} = user_check;
  
    try{
      if(receipt_check){
       receipt_check.isProviderAcknowledged = true;
  
       for (const id of packageDetails) {
        const packageCheck = await packagesTable.findById(id.packageID);
        const dateOfPurchase = id.dateOfPurchase;
        const { duration } = packageCheck;
        const durationInDays = parseFloat(duration) * 30;
  
        const packageValidation = new Date(dateOfPurchase);
        packageValidation.setDate(packageValidation.getDate() + durationInDays);
        
        id.validTill = packageValidation;
      }
  
        await receipt_check.save();
  
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: email,
          subject: `FitClub Connect: Payment Acknowledgement`,
          text: `Dear ${firstName},\n\nYour paymemt receipt has been acknowledged from the provider. For more information check the portal.`
        }
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) console.log("Error in sending acknowledgement: ", error);
          else console.log("Acknowledgement sent successfully");
        });
        return response.send({message: "Payment Acknowledged"})
      }
      return response.send({message: "Transaction ID Invalid"})
    }
    catch(error){
      console.log(error)
      return response.send({message: "Internal Server Error"})
    }
  };

const UploadVideo = async(request, response) => {
    const Workout_Video = cloudinary.uploader.upload(request.file?.path);
    const {video_name, video_url} = request.body;
    const {gymID} = request.params;
    const condition = await WorkoutVideo.findOne({video_name})
    try{
        if(condition){
            const VideoData = new WorkoutVideo({gymID, video_name, video_url, video:(await Workout_Video).secure_url})
            await VideoData.save();
            return response.send({message:"Video has been uploaded"})
        }
        else return response.send({message: "Video already exist"})
    }
    catch(error){
        response.send({message: "Internal Server Error"})
        console.log(error)
    }
}

const GetWorkoutVideo = async(request, response) => {
    try{
        const {gymID} = request.params;
        const workout_videos = await WorkoutVideo.find({gymID})
        response.send(workout_videos)
    }
    catch(error){
        console.log("Getting Error in retrivinng in workout videos"+error)
        response.send({message: "Internal Server Error"})
    }
}

module.exports = {SignUpFlow1,SignUpFlow2, VerifyOTP, SignIn, UpdateClubDetails, GetClubDetails, AccountDetails, GetReceiptForProvider, PaymentAcknowledgement, ForgotPassword, UploadVideo, GetWorkoutVideo}