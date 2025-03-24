import React, { useEffect, useState } from "react";
import "./myPackages.css";
import Modal from "react-modal";
import { BackendURL } from "../../../BackendContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const MyPackages = ({gymUser}) => {

  const API = BackendURL();
  const [refresh, setRefresh] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [packageDetails, setPackageDetails] = useState()
  const [updatePackage, setUpdateDetails] = useState({
    packageName: "",
    duration: "",
    price: "",
    description: ""
  })
  const [file, setFile] = useState()

  useEffect(() => {
    axios.get(`${API}/Package/GetPackageDetails/${gymUser._id}`)
    .then(response => setPackageDetails(response.data))
    .catch(error => console.error("Getting Erorr in fetching package details: "+error))
  },[gymUser._id, refresh])

  const OpenModal = packageID => {
    setIsOpen(packageID);
  };

  const CloseModal = () => {
    setIsOpen(false);
  };

  const handleChange = eventTriggered => {
    const {name, value} = eventTriggered.target
    setUpdateDetails({
      ...updatePackage,
      [name]:value
    })
  }

  const handleUpdatePackage = packageId => {
    const UpdatedPackageData = new FormData();
    Object.entries(updatePackage).forEach(([key, value]) => { UpdatedPackageData.append(key, value) });
    UpdatedPackageData.append("UpdatedPackageProfile",file);
    axios.put(`${API}/Package/UpdatePackageDetails/${packageId}`, UpdatedPackageData)
    .then(response => {
      if(response.data.message === "Package Details has been updated successfully"){
        toast.success(response.data.message)
        setRefresh(!refresh)
        setIsOpen(false)
        setIsEdit(false)
      }
      else toast.error(response.data.message)
    })
    .catch(error =>{
      toast.error("Error Occured")
       console.error("Getting error in updating package details: "+error)
      })
  }

  const DeletePackage = packageID => {
    axios.delete(`${API}/Package/DeletePackage/${packageID}`)
    .then(response => {
      if(response.data.message === "Package Deleted Successfully"){
        toast.success(response.data.message)
        setRefresh(!refresh)
        setIsOpen(false)
      }
      else toast.error(response.data.message)
    })
    .catch(error => {
      toast.error("Error Occured")
      console.error("Getting error in deleting package: "+error)
    })
  }

  return (
    <React.Fragment>
      <ToastContainer/>
      <div className="main-box">
        <div>
        <h2 className="club-side-title">My Packages</h2>
        </div>
       
           <div className="package-display-box">
          {packageDetails?.map(details => (
            <>
            <div className="package-card" key={details._id}>
            <img src={details.packageProfile? `${details.packageProfile}`:'./NoImage.jpg'} alt="Package Profile"/>
            <h3>{details.packageName}</h3>
            <div>
              <span>{details.duration}</span>
              <span style={{ color: "#FF7A59", fontWeight: "700" }}>
                Rs. {details.price}
              </span>
            </div>
            <button className="subscribe-button" onClick={() => OpenModal(details._id)}>See More</button>
          </div>
          <Modal
          isOpen={modalIsOpen===details._id}
          onRequestClose={CloseModal}
          className="my-package-description"
          overlayClassName="my-package-description-overlay"
        >
          {(isEdit===details._id)? 
          <React.Fragment>
            <div className="update-section">
              <input name="packageName" value={updatePackage.packageName} type="text" placeholder={details.packageName} onChange={handleChange}/>
              <input name="duration" value={updatePackage.duration} type="text" placeholder={details.duration} onChange={handleChange}/>
              <input name="price" value={updatePackage.price} type="number" placeholder={details.price} onChange={handleChange}/>
              <input type="file" onChange={e => setFile(e.target.files[0])}/>
              <textarea name="description" value={updatePackage.description} placeholder="description" onChange={handleChange}/>
            </div>
            <button className="subscribe-button" onClick={() => handleUpdatePackage(details._id)}>Save</button>
          </React.Fragment>
          :<React.Fragment>
            <img
            src={details.packageProfile? `${details.packageProfile}`:'./NoImage.jpg'}
            alt="Package Profile"
          />
          <div className="package-basic-info">
            <h3>{details.packageName}</h3>
            <span style={{ color: "grey", fontSize: "medium" }}>
            {details.duration}
            </span>
            <span
              style={{
                color: "#FF7A59",
                fontWeight: "700",
                fontSize: "medium",
              }}
            >
              Rs. {details.price}
            </span>
          </div>
          <div className="package-description-info">
            <label style={{ fontSize: "large", fontWeight: "600" }}>
              Description
            </label>
            <p>{details.description}</p>
          </div>
          
          <div className="my-packages-buttons">
            <button className="subscribe-button" onClick={() => setIsEdit(details._id)}>Edit</button>
            <button className="subscribe-button" onClick={() => DeletePackage(details._id)}>Delete</button>
          </div>

          </React.Fragment>}
        </Modal>
        </>
          ))}
        </div>
        
      </div>
    </React.Fragment>
  );
};

export default MyPackages;
