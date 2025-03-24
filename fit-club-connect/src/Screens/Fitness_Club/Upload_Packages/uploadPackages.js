import React, { useState } from "react";
import './uploadPackages.css';
import axios from "axios";
import { BackendURL } from "../../../BackendContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const UploadPackages=({gymUser})=>{

    const API = BackendURL();
    const navigate = useNavigate();
    const [packageDetails, setPackageDetails] = useState({
        gymID: gymUser._id,
        packageName: "",
        duration: "",
        price: "",
        description: ""
    });

    const [image, setImage] = useState();

    const handleChange= eventTriggered =>{
        const {name, value} = eventTriggered.target;
        setPackageDetails({
            ...packageDetails,
            [name]: value
        });
    }

    const UploadPackages=()=>{
        const packagesData = new FormData();
        Object.entries(packageDetails).forEach(([key, value]) => { packagesData.append(key, value) });
        packagesData.append("PackageProfile",image);
        const {packageName, duration, price, description} = packageDetails;
        if(packageName&&duration&&price&&description){
             axios.post(`${API}/Package/UploadPackage`, packagesData)
             .then(response=> {
                if(response.data.message === "Package already exists for this GYM"){
                    toast.error(response.data.message)
                }
                else{
                    toast.success(response.data.message)
                    setTimeout(() => {navigate("/MyPackages")},2000)
                }
             })
             .catch(error => {
                toast.error("Error Occured")
                console.error("Getting error in uploading package: "+error)
             })
        }
    }
    return(
        <React.Fragment>
            <ToastContainer/>
        <div className="main-box">
            <div className="upload-packages-box">
                <label className="package-field-labels position-pkjfeilds1">Package name</label>
                <input name="packageName" value={packageDetails.packageName} className="input-fields" type="text" onChange={handleChange}></input>
                <label className="package-field-labels position-pkjfeilds2">Duration(In Months)</label>
                <input name="duration" value={packageDetails.duration} className="input-fields" type="number" onChange={handleChange}></input>
                <label className="package-field-labels position-pkjfeilds3">Price</label>
                <input name="price" value={packageDetails.price} className="input-fields" type="number" onChange={handleChange}></input>
                <label className="package-field-labels position-pkjfeilds4">Package Profile</label>
                <input className="input-fields" type="file" onChange={e => setImage(e.target.files[0])}/>
                <label className="package-field-labels position-pkjfeilds5">Description</label>
                <textarea name="description" value={packageDetails.description} style={{height: '366px'}} className="input-fields" type="text" onChange={handleChange}></textarea>
                <button onClick={UploadPackages} className="upload-packages-button">Upload Package</button>
            </div>
        </div>
        </React.Fragment>
    );
}

export default UploadPackages