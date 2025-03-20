import React, { useEffect, useState } from "react";
import "./receipts.css"
import axios from "axios";

const Receipts = ({user}) => {

    const [receiptData, setReceiptData] = useState([])

    const isPaymentApproved = receiptData?.every(receipt => receipt.isProviderAcknowledged===true)
    const buttoneName = isPaymentApproved? 'Payment Approved':'Payment Pending'

    useEffect(() => {
        axios.get(`https://fit-club-connect-backend.vercel.app/Enthusiast/GetReceiptForConsumer/${user._id}`)
        .then(response => setReceiptData(response.data))
        .catch(error => console.error("Getting error in fetching receipt data: "+error))
    }, [user._id])

    return(
        <React.Fragment>
            <div className="main-boxx">
                    <div className="receipts-display-box">
                        {receiptData.length? 
                        <React.Fragment>
                             {receiptData?.map(receipt => (
                            <>
                            {receipt.packageDetails?.map(packages => (
                                <div className="receipt-card">
                            <img src="./logo.svg" alt="Payment Confirmation"/>
                            <div className="payment-details">
                                <label style={{fontSize:'xx-large'}}>Rs. {packages.packageID.price}</label>
                                <label>{user.firstName} <span style={{fontWeight:'100', textTransform:'none'}}>to</span> {receipt.gymID.gymName}</label>
                            </div>
                            <div className="package-details">
                                <div>
                                    <span>Package Name</span>
                                    <label>{packages.packageID.packageName}</label>
                                </div>
                                <div>
                                    <span>Date of Purchase</span>
                                    <label>{packages.dateOfPurchase}</label>
                                </div>
                                <div>
                                    <span>Valid Till</span>
                                    <label>{packages.validTill}</label>
                                </div>
                            </div>
                            <div className="payment-status">{buttoneName}</div>
                        </div>     
                            ))}
                            </>
                        ))}
                        </React.Fragment>:<p>Aap ne abhi tak koi package nahin khareeda</p>} 
                    </div>
            </div>
        </React.Fragment>
    )
}

export default Receipts