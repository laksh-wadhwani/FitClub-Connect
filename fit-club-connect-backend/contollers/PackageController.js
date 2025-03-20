const packagesTable = require("../models/Packages")
const {uploadToCloudinary} = require("../utils/cloudinary")

const UploadPackage = async(request, response) => {
    try {
        const { gymID, packageName, duration, price, description } = request.body;
        const packageProfile = uploadToCloudinary(request.file.buffer);
        const packageCheck = await packagesTable.findOne({ gymID, packageName });
        const durationInMonths = (duration)+ " Months"
        
        if (!packageCheck) {
            const newPackage = new packagesTable({ gymID, packageName, duration:durationInMonths, price, description, packageProfile});
            await newPackage.save();
            response.send({ message: "Package uploaded successfully"+"\nWait for Approval Now" });
        } 
        else {
            response.send({ message: "Package already exists for this GYM" });
        }
    } 
    catch (error) {
        console.log(error);
        response.send({ message: "Internal Server Error" });
    }
};

const UpdatePackageDetails = async(request, response) => {
    try{
        const packageId = request.params.id;
        const {packageName, duration, price, description} = request.body;
        const updatedPackageProfile = uploadToCloudinary(request.file.buffer);
        const packageCheck = await packagesTable.findById({_id:packageId});

        if(packageCheck){
            if(packageName) packageCheck.packageName = packageName;
            if(duration) packageCheck.duration = duration;
            if(price) packageCheck.price = price;
            if(description) packageCheck.description = description;
            if (updatedPackageProfile) packageCheck.packageProfile = updatedPackageProfile;

            await packageCheck.save();
            response.send({message: "Package Details has been updated successfully"});
        }
        else return console.log("Package not Found");
    }
    catch(error) { 
        console.log(error);
        response.send({message: "Error in updating packages details"});
    }
};

const GetPackageDetails = async(request, response) => {
    const gymID = request.params.id;

    await packagesTable.find({gymID})
    .then(packages => {
        const ApprovedPackages = packages.filter(package => package.isAdminVerified===true)
        response.send(ApprovedPackages)
    })
    .catch(error => {
        console.log(error);
        response.send({message:"Internal Server Error"})
    });
}

const DeletePackage = async(request, response) => {
    try{
        const packageID = request.params.id;
        const deletePackage = await packagesTable.findByIdAndDelete({_id:packageID});

        if(deletePackage) return response.send({message:'Package Deleted Successfully'});
        return response.send({message:'Package not found/already deleted'});
    }
    catch(error){ 
        console.log("Internal Server Error: "+error);
    }
}

module.exports = {UploadPackage, UpdatePackageDetails, GetPackageDetails, DeletePackage}