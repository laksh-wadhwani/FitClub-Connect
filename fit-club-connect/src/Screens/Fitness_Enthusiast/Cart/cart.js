import React, { useEffect, useState } from "react";
import "./cart.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import  Modal  from "react-modal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart=({user})=>{
    const { id } = useParams();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isRefresh, setRefresh] = useState(false)
    const [userBoughtPackages, setUserBoughtPackages] = useState([]);
    const [Receipt, setReceipt] = useState()
    const [error, setError] = useState({
      Receipt: '' 
  });

    
    useEffect(()=>{
        axios.get(`https://fit-club-connect-backend.vercel.app/Cart/GetCartDetailsForUser/${id}`)
        .then(response => { setUserBoughtPackages(response.data) })
        .catch(error => { console.error("Getting error in fetching cart package details: "+error) })
    },[id, isRefresh]);

    const packageCount = userBoughtPackages?.map(packages => packages.packageDetails.length)

    const totalPrice = userBoughtPackages?.reduce((total, packages) => {
      return (
        total +
        packages.packageDetails.reduce((acc, details) => {
          return acc + parseInt(details.packageID.price);
        }, 0)
      );
    }, 0);

    const isPackageApproved = userBoughtPackages?.every((packages) =>
      packages.packageDetails.every((approval) => approval.isApproval === true)
    );

    const buttonColor = (isPackageApproved && packageCount > 0)? 'transaction-btn':'transaction-btn-disabled'
    const buttonName = (isPackageApproved && packageCount > 0)? 'Pay Now':'Waiting for Approval'
    const buttonFuction = !(isPackageApproved && packageCount > 0)? true:false

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
          setReceipt(file);
          setError({ ...error, Receipt: "" });
      } else {
          setReceipt(null);
          setError({ ...error, Receipt: "Only image files are allowed." });
      }
  };

    const handleDelete = cartPackageID => {
      axios.delete(`https://fit-club-connect-backend.vercel.app/Cart/DeletePackageFromCart/${cartPackageID}`)
      .then(response => {
        toast.success(response.data.message)
        setRefresh(!isRefresh)
      })
      .catch(error => {
        toast.error("Error Occured")
        console.log("Getting error in deleting package from cart"+error)
      })
    };

    const OpenModal = () => {
      setIsOpen(true);
    };
  
    const CloseModal = () => {
      setIsOpen(false);
    };

    const UploadReceipt = (gymID, userID) => {
      const packageIDs = userBoughtPackages?.flatMap(packages =>
        packages.packageDetails.map(ids => ids.packageID._id)
      );
  
      const ReceiptData = new FormData();
      ReceiptData.append("PaymentReceipts", Receipt);
      packageIDs.forEach(id => {
        ReceiptData.append('packageIDs',id)
      })

      if(Receipt){
        axios.post(`https://fit-club-connect-backend.vercel.app/Enthusiast/MakePayment/${userID}/${gymID}`,ReceiptData)
      .then(response => {
        toast.success(response.data.message)
        setRefresh(!isRefresh)
        setIsOpen(false)
      })
      .catch(error => {
        toast.error("Error Occured")
        console.error("Getting Error in uploading payment receipt"+error)
      })
    }
    else {
      if (!Receipt) setError({ ...error, image: "Please upload an image file." });
  }
      }

    return(
    <React.Fragment>
      <ToastContainer/>
      <div className="main-boxx">
        <div className="cmplt">
        <div className="cart-render-box">
          {userBoughtPackages?.map(cart => (
            <>
            {cart.packageDetails?.map(details => (
              <div className="cart-details" key={details._id}>
              <div className="packagePicture-packageDetails">
                <img src={details.packageID?.packageProfile? `${details.packageID.packageProfile}`:'../NoImage.jpg'} alt="Package Profile"/>
                <div className="packageName-packageProvider">
                  <h4>{details.packageID.packageName}</h4>
                  <h5>{details.packageID.duration}</h5>
                  <h5>{cart.gymID.gymName}</h5>
                </div>
              </div>
              <h4>Rs. {details.packageID.price}</h4>
              <img src="../trash.svg" alt="Delete Icon" onClick={() => handleDelete(details._id)}/>
            </div>
            ))}
            </>
          ))}
        </div>
        <div className="package-summary">
          <h3>Package Summary</h3>
          <div className="subtotal">
            <h4 style={{color: 'gray', fontWeight: '300'}}>Subtotal ({packageCount} Packages)</h4>
            <h4>Rs. {totalPrice}</h4>
          </div>
          <div className="platform-charges">
            <h4 style={{color: 'gray', fontWeight: '300'}}>Platform Charges</h4>
            <h4>Free</h4>
          </div>
          <div className="total-price">
            <h4 style={{color: 'gray', fontWeight: '300'}}>Total</h4>
            <h4>Rs. {totalPrice}</h4>
          </div>
          <hr className="seperator"/>
          <button className={buttonColor} onClick={OpenModal} disabled={buttonFuction}>{buttonName}</button>
        </div>
        </div>

        <Modal
        isOpen={modalIsOpen}
        onRequestClose={CloseModal}
        className="cart-modal"
        overlayClassName="cart-modal-overlay"
        >
          <label style={{fontSize:'x-large', fontWeight:'600'}}>Account Details</label>
          {userBoughtPackages?.map(acc => (
            <>
            {acc?.gymID?.accountDetails.map(account => (
              <div className="account-details">
                <label>{account.bankName}</label>
                <label>Acocunt Title: <span>{account.accountTitle}</span></label>
                <label>Account No: <span>{account.accountNumber}</span></label>
              </div>
            ))}
          <div>
            <input type="file" onChange={handleFileChange}/>
            <p style={{ color: 'red', width: 'auto' }}>{error.image}</p>
            <button onClick={() => UploadReceipt(acc.gymID._id, user._id)}>Upload Receipt</button>
          </div>
          </>
          ))}
        </Modal>
      </div>
    </React.Fragment>
)}

export default Cart