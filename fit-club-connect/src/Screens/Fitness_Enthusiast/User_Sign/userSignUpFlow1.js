import React, { useRef, useState } from "react";
import './userSignUp.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSignUpFlow1 = () => {

    const navigate = useNavigate();
    const [isContinue, setIsContinue] = useState(false)
    const [user, setUser] = useState({
        email: "",
        c: "",
        o: "",
        d: "",
        e: ""
    })
    const {c,o,d,e,email} = user;
    const finalOTP = c+o+d+e;

    const cRef = useRef(null);
    const oRef = useRef(null);
    const dRef = useRef(null);
    const eRef = useRef(null);

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setUser({
            ...user,
            [name]:value
        })
    }

    const handleOtpChange = (eventTriggered, nextRef) => {
        const { name, value } = eventTriggered.target;
        setUser({
            ...user,
            [name]: value,
        });

        if (value.length === 1 && nextRef.current) {
            nextRef.current.focus();
        }
    };

    const isEmailValid = email => {
        const minLength = 3;
        const atLeastThreeCharactersRegex = /[a-zA-Z]{3,}/;
        const containsAtSymbolRegex = /@/;
    
        return (
            email.length >= minLength &&
            atLeastThreeCharactersRegex.test(email) &&
            containsAtSymbolRegex.test(email)
        );
    }
    

    const Continue = () => {
        if(isEmailValid(email)){
            axios.post("https://fit-club-connect-backend.vercel.app/Enthusiast/SignUpFlow1", {email})
            .then(response => {
                if(response.data.message === 'User has already been Registered'){
                    toast.error(response.data.message)
                }
                else{
                    toast.success(response.data.message)
                    setIsContinue(true);
                }
            })
            .catch(error => {
                toast.error("Error occurred")
                console.error("Error occured during user sign up"+error)
            })
        }
    }

    const Verify = () => {
        axios.post("https://fit-club-connect-backend.vercel.app/Enthusiast/VerifyOTP", {finalOTP, email})
        .then(response => {
            if(response.data.message === 'User has been registered successfully'){
                toast.success(response.data.message)
                setTimeout(() => {navigate(`/UserSignUpFlow2/${email}`)},2000)
            }
            else{
                toast.error(response.data.message)
                setTimeout(() => {navigate("/")},2000)
            }
        })
        .catch(error => {
            toast.error("Error Occured")
            console.error("Getting error during verifying otp user"+error)
        }) 
    }

    return(
        <React.Fragment>
            <ToastContainer/>
             <div className="main-boxx">
                <div className="signIn-box">
                    {isContinue? 
                    (<>
                    <div className="signIn-content" style={{alignSelf:'flex-start', marginLeft:'19px'}}>
                        <img src="./Mail Sign Up Icon.svg" alt="Mail Icon" style={{width:'73px', height:'73px'}}/>
                        <h4>Verify your email address to get started</h4>
                        <p style={{width:'auto'}}>This help us mitigate fraud and keep your personal data safe</p>
                    </div>

                    <div className="otpBox">
                        <input name='c' value={user.c} type='text' onChange={e => handleOtpChange(e, oRef)} ref={cRef} maxLength={1}/>
                        <input name='o' value={user.o} type='text' onChange={e => handleOtpChange(e, dRef)} ref={oRef}  maxLength={1}/>
                        <input name='d' value={user.d} type='text' onChange={e => handleOtpChange(e, eRef)} ref={dRef}  maxLength={1}/>
                        <input name='e' value={user.e} type='text' onChange={handleChange} ref={eRef}  maxLength={1}/>
                    </div>

                    <button className="login-btn" onClick={Verify}>Verify</button>
                    </>)
                   
                    :(<>
                        <div className="signIn-content" style={{alignSelf:'flex-start', marginLeft:'19px'}}>
                            <img src="./Mail Sign Up Icon.svg" alt="Mail Icon" style={{width:'73px', height:'73px'}}/>
                            <h4>What's Your Email ?</h4>
                        </div>

                        <div className="signIn-content">
                            <input name="email" value={email} type="email" placeholder="Email" onChange={handleChange}/>
                        </div>

                        <button className="login-btn" onClick={Continue}>Continue</button>
                    </>)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserSignUpFlow1;