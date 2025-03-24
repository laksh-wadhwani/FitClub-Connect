import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BackendURL } from "../../../BackendContext";

const UserSignIn = ({ setLoginUser }) => {

    const API = BackendURL();
    const navigate = useNavigate();
    const [isForgot, setIsForgot] = useState(false)
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleChange = eventTriggered => {
        const { name, value } = eventTriggered.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const Login = () => {
        const { email, password } = user;
        if (email && password) {
            axios.post(`${API}/Enthusiast/SignIn`, user)
                .then(response => {
                    if (response.data.message === 'Login Successful') {
                        toast.success(response.data.message);
                        setLoginUser(response.data.user);
                        setTimeout(() => {
                            navigate("/");
                        }, 2000); 
                    } else {
                        toast.error(response.data.message);
                    }
                })
                .catch(error => {
                    toast.error(error.response?.data?.message || "Error occurred");
                });
        }
    };

    const ForgotPassword = () => {
        const { email } = user;
        axios.post(`${API}/Enthusiast/ForgotPassword/${email}`)
            .then(response => {
                toast.success(response.data.message);
                setIsForgot(false);
            })
            .catch(error => {
                toast.error(error.response?.data?.message || "Error occurred");
            });
    };

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="main-boxx">
                <div className="signIn-box">
                    {isForgot ? 
                    <React.Fragment>
                        <div className="signIn-content">
                            <h4>Forgot Your Password</h4>
                            <input name="email" value={user.email} type="email" placeholder="Enter Your Registered Email" onChange={handleChange} />
                        </div>
                        <button className="login-btn" onClick={ForgotPassword}>Forgot</button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="signIn-content" style={{ alignSelf: 'flex-start', marginLeft: '19px' }}>
                            <img src="./Lock Icon.svg" alt="Lock Icon" style={{ width: '73px', height: '73px' }} />
                            <h4>Welcome Back!</h4>
                            <p>Login by typing you email and password</p>
                        </div>

                        <div className="signIn-content">
                            <input name="email" value={user.email} type="email" placeholder="Email" onChange={handleChange} />
                            <input name="password" value={user.password} type="password" placeholder="Password" onChange={handleChange} />
                            <p style={{ color: '#FF7A59', fontWeight: '500', cursor: 'pointer' }} onClick={() => setIsForgot(true)}>Forgot Your Password?</p>
                        </div>

                        <button className="login-btn" onClick={Login}>Login</button>
                    </React.Fragment>}
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserSignIn;
