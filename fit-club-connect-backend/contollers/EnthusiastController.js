const GenerateOTP = require("../middleware/OTP")
const transporter = require("../middleware/Mail")
const cloudinary = require("../utils/cloudinary")
const userTable = require("../models/FitnessEnthusiasts");
const fitnessTable = require("../models/FitnessClub");
const cartTable = require("../models/Cart");
const transaction = require("../models/Transaction")


const SignUpFlow1 = async(request, response) => {
    try{
        const { email } = request.body;
        const OTP = GenerateOTP();
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
        const newUser = new userTable({ email, OTP, otpExpiry});
        const userCheck = await userTable.findOne({ email });

        if(!userCheck){
            console.log(`OTP for ${email}:${OTP}`);
            const otpExpiryInMinutes = Math.ceil((otpExpiry - Date.now()) / (1000 * 60));
            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: email,
                subject: "Secure Your Fit Club Connect Account - Your One-Time Password (OTP) Details Inside",
                text: `Dear Sir/Ma'am,\nWe hope this message finds you well. To ensure the security of your Fit Club Connect account, we have implemented an additional layer of protection through One-Time Password (OTP) authentication.\nYour OTP Details:\nOTP: ${OTP}\nValidity: ${otpExpiryInMinutes} minutes\nPlease use the provided OTP to verify and access your Fit Club Connect account securely. If you did not request this OTP or suspect any unauthorized activity, please contact our support team immediately.\nThank you for choosing Fit Club Connect for your fitness journey. Stay active and stay secure!\nBest regards,\nFit Club Connect Team`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) console.log("Error in sending OTP: ", error);
                else console.log("OTP sent successfully");
            });

            await newUser.save();
            response.send({ message: "Please enter OTP to get registered" });

            if (userTable.isVerified) {
                setTimeout(async () => {
                    await userTable.findOneAndDelete({ email });
                    console.log("User deleted due to OTP expiration");
                }, otpExpiry - Date.now());
            }

        }
        else {
            return response.send({ message: "User has already been Registered" });
        }
    }
    catch(error){
        console.log(error)
        return response.send({message: "Internal Server Error"})
    }
};

const SignUpFlow2 = async(request, response) => {
    const {email} = request.params;
    const {firstName, lastName, phoneNo, password} = request.body;
    const UserProfile = cloudinary.uploader.upload(request.file?.path)
    const userCheck = await userTable.findOne({email})
    try{
        if(userCheck){
            if(firstName) userCheck.firstName=firstName;
            if(lastName) userCheck.lastName=lastName;
            if(phoneNo) userCheck.phoneNo=phoneNo;
            if(password) userCheck.password=password;
            if(UserProfile) userCheck.UserProfile = (await UserProfile).secure_url;
            await userCheck.save();
            return response.send({message:"Fitness Enthusiast has been registerd us successfully"+"\nYou can sign in now"})
        }
        else return response.send({message:"This Email is not exist"})
    }
    catch(error){
        console.log(error)
        return response.send({message: "Internal Server Error"})
    }
};

const VerifyOTP = async(request,response) => {
    try {
        const { finalOTP, email } = request.body;
        const userCheck = await userTable.findOne({ email });

        if (userCheck) {
            if (userCheck.OTP === finalOTP) {
                userCheck.OTP = null;
                userCheck.otpExpiry = null;
                userCheck.isVerified = true;
                await userCheck.save();
                response.send({ message: "User has been registered successfully" });
            } 
            else {
                await userTable.findOneAndDelete({ email });
                response.send({ message: "You Entered Wrong OTP" });
            }
        } 
        else {
            response.send({ message: "User Not Found" });
        }
    } 
    catch (error) {
        console.log(error);
        response.send({ message: "Error verifying OTP" });
    }
}

const Login = async(request, response) => {
    try{
        const { email, password } = request.body;

        const user = await userTable.findOne({ email });

        if (!user) {
            return response.send({ message: "Invalid Credentials" });
        }

        if (user.password === password) {
            return response.send({ message: "Login Successful", user: user });
        } 

        else {
            return response.send({ message: "Invalid Password" });
        }
    }

    catch(error){
        console.log(error)
        return response.send({message: "Internal Server Error"});
    }
};

const ForgotPassword = async(request, response) => {
    try{
        const { email } = request.params;
        const userCheck = await userTable.findOne({email})
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

const MakePayment = async(request, response) => {
    const {userID, gymID} = request.params;
    const {packageIDs} = request.body;
    const payment_receipt = cloudinary.uploader.upload(request.file?.path);
    const condition = await transaction.findById(userID, gymID)
    const packageLength = (packageIDs.length===24)? true: false;
    const userCheck = await fitnessTable.findById(gymID)
    const {email, firstName} = userCheck;
  
    try{
      if(!condition){
        if(packageLength){
          const singleTransaction = new transaction({userID, gymID, packageDetails: [{packageID: packageIDs}], payment_receipt:(await payment_receipt).secure_url})
          await singleTransaction.save();
        }
        else{
          const packageDetails = packageIDs?.map(packageID => ({packageID}))
          const multipleTransaction = new transaction({userID, gymID, packageDetails, payment_receipt:(await payment_receipt).secure_url})
          await multipleTransaction.save();
        }
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: email,
          subject: "Check portal for payment receipt",
          text:  `Hello ${firstName} \nYou've recieved a payment for the package for more information please check portal and give acknowledgement`
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) console.log("Error in sending payment receipt: ", error);
          else console.log("Payment receipt sent successfully");
        });
        await cartTable.findOneAndDelete({userID, gymID});
        return response.send({message: "Payment receipt has sent"+"\nPlease wait for provider's acknowledgement now"})
      }
      return response.send({message: "Package has already subscribed"})
    }
    catch(error){
      console.log(error)
      response.send({message: "Internal Server Error"})
    }
  };

  const GetReceiptForConsumer = async(request, response) => {
    const {userID} = request.params;
    try{
      const receipt_check = await transaction.find({userID}).populate('packageDetails.packageID gymID')
      return response.send(receipt_check)
    }
    catch(error){
      console.log(error)
      return response.send({message: "Internal Server Error"})
    }
  };

  const UpdateUserDetails = async(request, response) => {
    try {
        
        const {userID} = request.params;
        const {firstName, lastName, email, phoneNo, currentPass, newPass} = request.body;
        const userProfileUpdated = cloudinary.uploader.upload(request.file?.path);
        const basicInfo = await userTable.findById(userID);

        if(basicInfo){
            const isPasswordValid = await basicInfo.password===currentPass;
            if(firstName) basicInfo.firstName = firstName;
            if(lastName) basicInfo.lastName = lastName;
            if(email) basicInfo.email = email;
            if(phoneNo) basicInfo.phoneNo = phoneNo;
            if(userProfileUpdated) basicInfo.UserProfile = (await userProfileUpdated).secure_url;
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
        return response.send({ message: "Internal Server Error" });
    }
};

  
module.exports = {SignUpFlow1, SignUpFlow2, VerifyOTP, ForgotPassword, Login, MakePayment, GetReceiptForConsumer, UpdateUserDetails}