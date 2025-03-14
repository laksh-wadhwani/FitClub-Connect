import React, { useState } from "react";
import './signIn.css'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = ({setLoginUser}) => {

    const navigate = useNavigate();
    const [isForgot, setIsForgot] = useState(false)
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target
        setUser({
            ...user,
            [name]:value
        })
    };

    const Login = () => {
        const {email, password} = user
        if(email&&password){
            axios.post("http://localhost:9002/Admin/SignIn", user)
            .then(response => {
                alert(response.data.message)
                setLoginUser(response.data.user)
                navigate("/ClubApproval")
            })
            .catch(error => alert(error.data.message))
        }
    }

    const ForgotPassword = () => {
        const {email} = user
        if(email){
            axios.post(`http://localhost:9002/Admin/ForgotPassword/${email}`)
            .then(response => {
                alert(response.data.message)
                setIsForgot(false)
        })
        }else{
            alert("Please enter email")
        }
    }

    return(
        <React.Fragment>
            <div className="main-box">
                <div className="sign-box">
                    {isForgot? 
                    <React.Fragment>
                        <div className="sign-content">
                            <h4>Forgot Your Password</h4>
                            <input name="email" value={user.email} type="email" placeholder="Enter Your Registered Email" onChange={handleChange}/>
                        </div>
                        <button className="login-btn" onClick={ForgotPassword}>Forgot</button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="sign-content">
                        <img src="./Lock Icon.svg" alt="Lock Icon" style={{width:'73px', height:'73px'}}/>
                        <h4>Welcome Back!</h4>
                        <p>Login by typing you email and password</p>
                    </div>

                    <div className="sign-content">
                        <input name="email" value={user.email} type="email" placeholder="Email" onChange={handleChange}/>
                        <input name="password" value={user.password} type="password" placeholder="Password" onChange={handleChange}/>
                        <p style={{color:'#FF7A59'}} onClick={() => setIsForgot(true)}>Forgot Your Password</p>
                    </div>
                    
                    <button onClick={Login}>Sign In</button>
                    <p>Don't have an account 
                        <Link to="/SignUp" style={{textDecoration:'none'}}><span style={{color:'#FF7A59', cursor:'pointer'}}>Sign Up</span></Link>
                    </p>
                    </React.Fragment>}
                </div>
            </div>
        </React.Fragment>
    )
}

export default SignIn;
