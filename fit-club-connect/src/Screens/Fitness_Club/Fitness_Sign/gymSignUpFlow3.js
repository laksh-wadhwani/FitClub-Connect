import React, { useState } from "react";
import "./gymSignUp.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BackendURL } from "../../../BackendContext";

const GymSignUpFlow3 = () => {
    
    const API = BackendURL();
    const navigate = useNavigate();
    const {email} = useParams();
    const [numAccounts, setNumAccounts] = useState(1);
    const [accounts, setAccounts] = useState([{ 
            bankName: '', 
            accountTitle: '', 
            accountNumber: '' 
    }]);

    const handleNumAccountsChange = eventTriggered => {
        const value = parseInt(eventTriggered.target.value, 10);
        if (value >= 1 && value <= 5) {
            setNumAccounts(value);
            setAccounts(Array(value).fill().map(() => ({ bankName: '', accountTitle: '', accountNumber: '' })));
        }
    };

    const handleAccountChange = (index, field, value) => {
        const newAccounts = accounts.map((account, i) => 
          i === index ? { ...account, [field]: value } : account
        );
        setAccounts(newAccounts);
    };

    const Submit = () => {
        axios.put(`${API}/Club/AccountDetails/${email}`,{accounts})
        .then(response => {
            toast.success(response.data.message)
            setTimeout(() => {navigate("/GymSignIn")},2000)
        })
        .catch(error => {
            toast.error("Error Occured")
            console.error("Getting error in uploading account details: "+error)
        })
      }
    return(
        <React.Fragment>
            <ToastContainer/>
            <div className="main-boxx">
                <div className="gym-signUp">
                    <div className="signUp-bg" />
                    <div className="signUp-text">
                        <h4>
                            Boost your gym's success with{" "}
                            <span style={{color:"#FF7A59"}}>fitclub connect</span>!
                        </h4>
                        <p>
                            Join now and enhance your revenue with the leading fitness
                            platform FitClub Connect. Sign up today and unlock a world of
                            opportunities for your gym or studio.
                        </p>
                    </div>

                    <div className="signUp-box">

                        <div style={{width: "270px", gap: 0, alignSelf: "flex-start",marginLeft: "19px"}}>
                            <img src="../Mail Sign Up Icon.svg" alt="Mail Icon" style={{ marginLeft: "21px" }}/>
                            <h4>Let's Get You Started!</h4>
                            <p> First, let’s create your FitClub account with <span style={{color:"black", fontWeight:'400'}}>{email}</span></p>
                        </div> 

                        <label style={{justifyContent:'center', color:'black'}}>Fitness Club Acoount Details</label> 

                        <div>
                            <input type="number" value={numAccounts} onChange={handleNumAccountsChange} min="1" max="5"/>
                            {accounts.map((account, index) => (
                            <React.Fragment>
                                <h3>Account {index + 1}</h3>
                                <label style={{
                                        position: 'absolute',
                                        right: '10.1rem',
                                        top: '13.3rem',
                                        fontSize: 'small',
                                        backgroundColor: 'white',
                                        width: 'auto',
                                        height: 'auto',
                                        fontWeight: '100'}}>Enter Number of Accounts(1-5)</label>
                                <input type="text" value={account.bankName} placeholder="Enter Bank Name" onChange={(e) => handleAccountChange(index, 'bankName', e.target.value)}/>
                                <input type="text" value={account.accountTitle} placeholder="Enter Account Title" onChange={(e) => handleAccountChange(index, 'accountTitle', e.target.value)}/>
                                <input type="text" value={account.accountNumber} placeholder="Enter Account Number" onChange={(e) => handleAccountChange(index, 'accountNumber', e.target.value)}/>
                            </React.Fragment>
                            ))} 
                        </div>
                        {numAccounts > 0 && <button onClick={Submit}>Submit</button>}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default GymSignUpFlow3