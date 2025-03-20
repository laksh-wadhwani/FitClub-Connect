import React, { useEffect, useState } from "react";
import "./packageApprovals.css";
import Modal from "react-modal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const PackageApprovals = ({gymUser}) => {
  const [isReject, setIsReject] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false)
  const [cartDetails, setDetails] = useState([])
  const [receiptData, setReceiptData] = useState([])
  const [rejectedRemarks, setRemarks] = useState()

  useEffect(() => {
    axios.get(`https://fit-club-connect-backend.vercel.app/Cart/GetCartDetailsForClub/${gymUser._id}`)
    .then(response => setDetails(response.data))
    .catch(error => console.error("Getting error in fetching cart approval details"+error))

    axios.get(`https://fit-club-connect-backend.vercel.app/Club/GetReceiptForProvider/${gymUser._id}`)
    .then(response => setReceiptData(response.data))
    .catch(error => console.error("Getting error in fetching receipts data: "+error))
  },[gymUser._id, isRefresh])

  const OpenModal = cartPackageID => {
    setIsOpen(cartPackageID);
  };

  const CloseModal = () => {
    setIsOpen(false);
  };

  const ApprovePackage = cartPackageID => {
    axios.put(`https://fit-club-connect-backend.vercel.app/Cart/CartPackageApproval/${cartPackageID}`)
    .then(response => {
      if(response.data.message === "Request has been approved successfully"){
        toast.success(response.data.message)
        setIsRefresh(!isRefresh)
        setIsOpen(false)
      }
      else toast.error(response.data.message)
    })
    .catch(error => {
      toast.error("Error Occured")
      console.error("Getting erorr in approving package: "+error)
    })
  }
  
  const RejectPackage = (cartPackageID, userID) => {
    axios.delete(`https://fit-club-connect-backend.vercel.app/Cart/CartPackageReject/${cartPackageID}/${userID}`,{ params: {rejectedRemarks} })
    .then(response => {
      if(response.data.message === "Package has been rejected"){
        toast.success(response.data.message)
        setIsRefresh(!isRefresh)
        setIsReject(false)
        setIsOpen(false)
      }
      else toast.error(response.data.message)
    })
    .catch(error => {
      toast.error("Error Occured")
      console.error("Getting error in rejecting package: "+error)
    })
  }

  const Acknowledgement = transactionID => {
    axios.put(`https://fit-club-connect-backend.vercel.app/Club/PaymentAcknowledgement/${transactionID}`)
    .then(response => {
      if(response.data.message === "Payment Acknowledged"){
        toast.success(response.data.message)
        setIsOpen(false)
        setIsRefresh(!isRefresh)
      }
      else toast.error(response.data.message)
    })
    .catch(error => {
      toast.error("Error Occured")
      console.error("Getting error in acknowledge the receipt: "+error)
    })
  }

  return (
    <React.Fragment>
      <ToastContainer/>
      <div className="main-box">
        {console.log(receiptData)}
      <h2 className="club-side-title">Receipts Approvals</h2>
        <div className="receipt-display-box">
          {receiptData.length? 
          <React.Fragment>
             {receiptData?.map(receipt => (
            <div className="package-card" key={receipt._id} style={{height:'100px', padding:'0.5rem'}}>
            <h3>You have got payment from {receipt.userID.firstName} {receipt.userID.lastName}</h3>
            <button className="subscribe-button" onClick={() => OpenModal(receipt._id)}>See More</button>
            <Modal
            isOpen={modalIsOpen===receipt._id}
            onRequestClose={CloseModal}
            className="my-package-description"
            overlayClassName="my-package-description-overlay">
              <img src={`${receipt.payment_receipt}`} alt="Payment Receipt"/>
              {receipt.packageDetails?.map(packages => (
                 <div className="package-basic-info" key={packages._id}>
                  <h3>Package Name: {packages.packageID.packageName}</h3>
                </div>
              ))}
              <div className="package-description-info">
                <label>{receipt.userID.firstName} {receipt.userID.lastName} has sent you payment for the above packages. Please acknowledge</label>
              </div>
              <button className="subscribe-button" onClick={() => Acknowledgement(receipt._id)}>Acknowledge</button>
            </Modal>
          </div>
          ))}
          </React.Fragment>:<p>There are no payments approvals pending</p>}
        </div>

        <h2 className="club-side-title">Package Approvals</h2>
        <div className="package-display-box">
          {cartDetails.length? 
          <React.Fragment>
            {cartDetails?.map(details => (
            <>
            {details.packageDetails?.map(packages => (
              <>
              <div className="package-card" key={packages._id}>
              <img src={packages.packageID.packageProfile? `${packages.packageID.packageProfile}`:"./NoImage.jpg"} alt="Package Profile" />
              <h3>{packages.packageID.packageName}</h3>
              <div>
                <span>{packages.packageID.duration}</span>
                <span style={{ color: "#FF7A59", fontWeight: "700" }}>
                  Rs. {packages.packageID.price}
                </span>
              </div>
              <button className="subscribe-button" onClick={() => OpenModal(packages._id)}>See More</button>
            </div>
            <Modal
            isOpen={modalIsOpen===packages._id}
            onRequestClose={CloseModal}
            className="my-package-description"
            overlayClassName="my-package-description-overlay"
          >
            {(isReject===details._id)? 
            <React.Fragment>
              <div className="update-section">
                <textarea name="rejectedRemarks" value={rejectedRemarks} placeholder="enter remarks why are you rejecting the package" style={{width:'224px', height:'200px'}} onChange={e => setRemarks(e.target.value)}/>
              </div>
              <button className="subscribe-button" onClick={() => RejectPackage(packages._id, details.userID._id)}>Reject Package</button>
            </React.Fragment>
            :<React.Fragment>
              <img
              src={packages.packageID.packageProfile? `${packages.packageID.packageProfile}`:"./NoImage.jpg"}
              alt="Package Profile"
            />
            <div className="package-basic-info">
              <h3>{packages.packageID.packageName}</h3>
              <span style={{ color: "grey", fontSize: "medium" }}>
              {packages.packageID.duration}
              </span>
              <span
                style={{
                  color: "#FF7A59",
                  fontWeight: "700",
                  fontSize: "medium",
                }}
              >
                {packages.packageID.price}
              </span>
            </div>
            <div className="package-description-info">
              <label>
                {details.userID.firstName} {details.userID.lastName} with the Mobile No {details.userID.phoneNo} has requested you for the above package
              </label>
            </div>
            
            <div className="my-packages-buttons">
            <button className="subscribe-button" onClick={() => ApprovePackage(packages._id)}>Approve</button>
              <button className="subscribe-button" onClick={() => setIsReject(details._id)}>Reject</button>
            </div>

            </React.Fragment>}
          </Modal>
          </>
            ))}
            </>
          ))}
          </React.Fragment>
          :<p>There are no request pending for package approvals</p>}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PackageApprovals;
