const cartTable = require("../models/Cart");
const userTable = require("../models/FitnessEnthusiasts");
const transporter = require("../middleware/Mail")

const AddToCart = async(request, response) => {
    try {
        const { userID, packageID, gymID } = request.params;

        const packageCheck = await cartTable.findOne({userID, 'packageDetails.packageID':packageID})
        if(packageCheck) return response.send({message: "Package has already been in the cart"})
        
        const gymCheck = await cartTable.findOne({userID, gymID:{ $ne:gymID }})
        if(gymCheck) return response.send({message: "A package from different gym has already been in the cart.\nPlease pay for or delete the existing package before adding a new one"})
        
        const cart = await cartTable.findOne({userID, gymID})
        if(cart){
            cart.packageDetails.push({packageID})
            await cart.save();
            return response.send({message: "Package has been added to the cart"})
        }

        const newPackage = new cartTable({userID, gymID, packageDetails:[{packageID}]})
        await newPackage.save();
        return response.send({message: "Package has been added to the cart"})
    } 
    catch (error) {
        console.log(error);
        return response.send({ message: 'Internal Server Error' });
    }
};

const CartPackageApproval = async(request, response) => {
    try {
        const { cartPackageID } = request.params;
        const packageCheck = await cartTable.findOne({'packageDetails._id':cartPackageID})
        
    
        if (packageCheck) {
          const packageNumber = packageCheck.packageDetails.findIndex(pckg => pckg._id == cartPackageID);
          if (packageNumber != -1)
            packageCheck.packageDetails[packageNumber].isApproval = true;
          await packageCheck.save();
          return response.send({message:'Request has been approved successfully'})
        } 
        else {
          return response.send({ message: "This package is not exist" });
        }
      } catch (error) {
        console.log(error);
        return response.send({ message: "Internal Server Error" });
      }
};

const CartPackageReject = async(request, response) => {
    try {
        const { cartPackageID, userID } = request.params;
        const { rejectedRemarks } = request.query;
        const userCheck = await userTable.findById(userID)
        const {firstName, email} = userCheck
        const packageCheck = await cartTable.updateOne(
            {"packageDetails._id":cartPackageID},
            {$pull: {packageDetails: {_id:cartPackageID}}}
        )

        if(packageCheck){
            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: email,
                subject: "Package Reject from Provider",
                text: `Dear ${firstName} \n\nYour Package has been rejected from the provider and he gives the reason \n${rejectedRemarks}\n\nFor more information please check th cart`
              }
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) console.log("Error in sending payment receipt: ", error);
                else console.log("Reject mail sent successfully");
              });
              await response.send({message: "Package has been rejected"})
        }
        else return response.send({message: "Package Not Found"})
      } catch (error) {
        console.log(error);
        return response.send({ message: "Internal Server Error" });
      }
};

const GetCartDetailsForClub = async(request, response) => {
    try {
        const { gymID } = request.params;
        const cartDetails = await cartTable.find({ gymID }).populate("packageDetails.packageID gymID userID");
    
        const filteredCartDetails = cartDetails.map(cart => {
          cart.packageDetails = cart.packageDetails.filter(packageDetail => packageDetail.isApproval === false);
          return cart;
        }).filter(cart => cart.packageDetails.length > 0); 
        
        return response.send(filteredCartDetails);
    
      } catch (error) {
        console.log("Getting Error in sending details of cart for provider: " + error);
        return response.status(500).send({ message: "Internal Server Error" });
      }
};

const GetCartDetailsForUser = async(request, response) => {
    try {
        const { userID } = request.params;
        const packageDetails = await cartTable.find({userID}).populate("packageDetails.packageID gymID")
        await response.send(packageDetails)
    } 
    catch (error) {
        console.log(error);
        response.send({ message: "Internal Server Error" });
    }
};

const DeletePackageFromCart = async(request, response) => {
    try {
        const { cartPackageID } = request.params;
        const packageCheck = await cartTable.updateOne(
          {"packageDetails._id":cartPackageID},
          {$pull: {packageDetails: {_id:cartPackageID}}}
        )

        if (packageCheck) return response.send({message: "Package has been removed successfully",});
        else return response.send({ message: "Package not found" })

      } catch (error) {
        console.log(error);
        response.send({ message: "Internal Server Error" });
      }
}

module.exports = {AddToCart, CartPackageApproval, GetCartDetailsForClub, GetCartDetailsForUser, DeletePackageFromCart, CartPackageReject}