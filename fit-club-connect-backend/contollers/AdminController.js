const GenerateOTP = require("../middleware/OTP");
const transporter = require("../middleware/Mail");
const {uploadToCloudinary} = require("../utils/cloudinary");
const AdminTable = require("../models/Admin");
const fitnessTable = require("../models/FitnessClub");
const RejectedClubTable = require("../models/RejectedClubs");
const packagesTable = require("../models/Packages");
const RejectedPackages = require("../models/RejectedPackages");

const SignUp = async (request, response) => {
  const SECREY_KEY = "FITCLUB2223";
  const { firstName, lastName, email, phoneNo, password, secretKey } =
    request.body;
  const adminProfile = uploadToCloudinary(request.file.buffer);
  console.log(await adminProfile);
  const OTP = GenerateOTP();
  console.log(`OTP for ${email} is ${OTP}`);
  const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
  const newAdminUser = new AdminTable({
    firstName,
    lastName,
    email,
    phoneNo,
    password,
    adminProfile: adminProfile
  });
  const userCheck = await AdminTable.findOne({ email });

  try {
    if (SECREY_KEY === secretKey) {
      if (!userCheck) {
        const otpExpiryInMinutes = Math.ceil(
          (otpExpiry - Date.now()) / (1000 * 60)
        );
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: email,
          subject:
            "Secure Your Fit Club Connect Account - Your One-Time Password (OTP) Details Inside",
          text: `Dear Sir/Ma'am,\nWe hope this message finds you well. To ensure the security of your Fit Club Connect account, we have implemented an additional layer of protection through One-Time Password (OTP) authentication.\nYour OTP Details:\nOTP: ${OTP}\nValidity: ${otpExpiryInMinutes} minutes\nPlease use the provided OTP to verify and access your Fit Club Connect account securely. If you did not request this OTP or suspect any unauthorized activity, please contact our support team immediately.\nThank you for choosing Fit Club Connect for your fitness journey. Stay active and stay secure!\nBest regards,\nFit Club Connect Team`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) console.log("Error in sending OTP: ", error);
          else console.log("OTP sent successfully");
        });
        await newAdminUser.save();
        response.send({ message: "Please Enter OTP to get registered" });
        if (AdminTable.isVerified) {
          setTimeout(async () => {
            await AdminTable.findOneAndDelete({ email });
            console.log("User deleted due to OTP expiration");
          }, otpExpiry - Date.now());
        }
      } else return response.send({ message: "User Already Exist" });
    } else return response.send({ message: "Invalid Secret Key" });
  } catch (error) {
    console.log(error);
    return response.send({ message: "Internal Server Error" });
  }
};

const VerifyOTP = async (request, response) => {
  try {
    const { finalOTP, email } = request.body;
    const userCheck = await AdminTable.findOne({ email });

    if (userCheck) {
      if (userCheck.OTP === finalOTP) {
        userCheck.OTP = null;
        userCheck.otpExpiry = null;
        userCheck.isVerified = true;
        await userCheck.save();
        response.send({ message: "User has been registered successfully" });
      } else {
        await AdminTable.findOneAndDelete({ email });
        response.send({ message: "You Entered Wrong OTP" });
      }
    } else response.send({ message: "User Not Found" });
  } catch (error) {
    console.log(error);
    response.send({ message: "Error verifying OTP" });
  }
};

const SignIn = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await AdminTable.findOne({ email });

    if (!user) return response.send({ message: "You are not registered" });
    if (user.password === password)
      return response.send({ message: "Login Successful", user: user });
    if (user.password !== password)
      return response.send({ message: "Invalid Password" });
  } catch (error) {
    console.log(error);
    response.send({ message: "Error Logging In" });
  }
};

const ForgotPassword = async (request, response) => {
  try {
    const { email } = request.params;
    const userCheck = await AdminTable.findOne({ email });
    if (userCheck) {
      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "Reset Your Password for FitClub Connect",
        text: `Hi ${userCheck.firstName} \nYour Password: ${userCheck.password}`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log("Error in sending OTP: ", error);
        else
          console.log("Forgot Password Sent Successfully", userCheck.password);
      });
      response.send({
        message: "Your Password has been sent at your mail successfully",
      });
    } else return response.send({ message: "Email Not Found" });
  } catch (error) {
    console.log(error);
    response.send({ message: "Internal Server Error" });
  }
};

const GetClubDetailsForApproval = (request, response) => {
  fitnessTable.find().then((data) => {
    const isAdminVerified = data.filter(
      (club) => club.isAdminVerified === false
    );
    response.send(isAdminVerified);
  });
};

const ClubApproval = async (request, response) => {
  const { clubID } = request.params;
  const clubCheck = await fitnessTable.findById({ _id: clubID });

  try {
    if (clubCheck) {
      clubCheck.isAdminVerified = true;
      await clubCheck.save();
      return response.send({ message: "Club Has Been Approved" });
    }
  } catch (error) {
    console.log(error);
    response.send({ message: "Internal Server Error" });
  }
};

const ClubRejection = async (request, response) => {
  const { gymID, adminID } = request.params;
  const { remarks } = request.body;

  try {
    const ClubCheck = await fitnessTable.findOne({ _id: gymID });
    if (ClubCheck) {
      const { gymName, gymProfile } = ClubCheck;
      const RejectedClubDetails = new RejectedClubTable({
        adminID,
        gymID,
        gymName,
        gymProfile,
        adminRemarks: remarks,
      });
      await RejectedClubDetails.save();
      await ClubCheck.deleteOne();
      return response.send({ message: "Club Rejected and Deleted" });
    } else return response.send({ message: "Club Already Deleted/Not Found" });
  } catch (error) {
    console.log(error);
    response.send({ message: "Internal Server Error" });
  }
};

const GetOverallClubDetails = async (request, response) => {
  const ApprovedClubs = await fitnessTable.find({ isAdminVerified: true });
  const RejectedClubs = await RejectedClubTable.find();
  try {
    const AllClubs = [...ApprovedClubs, ...RejectedClubs];
    const ApprovedClubsLength = ApprovedClubs.length;
    const RejectedClubsLength = RejectedClubs.length;
    return response.send({
      AllClubs,
      ApprovedClubsLength,
      RejectedClubsLength,
    });
  } catch (error) {
    console.log(error);
    response.send({ message: "Internal Server Error" });
  }
};

const GetPackageDetailsForApproval = async (request, response) => {
  await packagesTable
    .find({ isAdminVerified: false })
    .populate("gymID")
    .then((packages) => response.send(packages))
    .catch((error) => {
      console.log(error);
      response.send({ message: "Internal Server Error" });
    });
};

const PackageApproval = async (request, response) => {
  const { packageID } = request.params;
  const packageCheck = await packagesTable.findOne({ _id: packageID });

  try {
    if (packageCheck) {
      packageCheck.isAdminVerified = true;
      await packageCheck.save();
      return response.send({ message: "Package has been approved" });
    } else
      return response.send({
        message: "Package is already Approved/Not Found",
      });
  } catch (error) {
    console.log(error);
    response.send({ message: "Internal Server Error" });
  }
};

const PackageRejection = async (request, response) => {
  const { packageID, adminID } = request.params;
  const { remarks } = request.body;

  try {
    const packageCheck = await packagesTable.findOne({ _id: packageID });
    const { gymID, packageName, packageProfile } = packageCheck;
    if (packageCheck) {
      const package = new RejectedPackages({
        adminID,
        packageID,
        gymID,
        packageName,
        packageProfile,
        adminRemarks: remarks,
      });
      await package.save();
      await packageCheck.deleteOne({ _id: packageID });
      return response.send({ message: "Package has rejected and deleted" });
    } else
      return response.send({
        message: "Package has already rejected/not found",
      });
  } catch (error) {
    console.log(error);
    response.send({ message: "Internal Server Error" });
  }
};

const GetOverallPackageDetails = async (request, response) => {
  const PackagesRejected = await RejectedPackages.find().populate("gymID");
  const PackagesApproved = await packagesTable
    .find({ isAdminVerified: true })
    .populate("gymID");
  try {
    const AllPackages = [...PackagesRejected, ...PackagesApproved];
    const ApprovedPackagesLength = PackagesApproved.length;
    const RejectedPackagesLength = PackagesRejected.length;
    response.send({
      AllPackages,
      ApprovedPackagesLength,
      RejectedPackagesLength,
    });
  } catch (error) {
    console.log(error);
    response.send({ message: "Internal Server Error" });
  }
};

module.exports = {
  SignUp,
  VerifyOTP,
  SignIn,
  GetClubDetailsForApproval,
  ClubApproval,
  ClubRejection,
  GetOverallClubDetails,
  GetPackageDetailsForApproval,
  PackageApproval,
  PackageRejection,
  GetOverallPackageDetails,
  ForgotPassword,
};
