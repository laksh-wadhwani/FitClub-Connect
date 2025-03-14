import React, { useState } from "react";
import "./userSignUp.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSignUpFlow2 = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        phoneNo: "",
        password: "",
    });
    const [image, setImage] = useState();
    const [error, setError] = useState({
        firstName: '',
        lastName: '',
        password: '',
        phoneNo: '',
        image: '' 
    });

    
    const isPasswordValid = (password) => {
        const minLength = 6;
        const atLeastOneCapitalLetter = 1;
        const atLeastOneSmallLetter = 1;
        const atLeastOneNumber = 1;
        const atLeastOneSpecialCharacter = 1;

        const atLeastOneCapitalLetterRegex = /[A-Z]/;
        const atLeastOneSmallLetterRegex = /[a-z]/;
        const atLeastOneNumberRegex = /\d/;
        const atLeastOneSpecialCharacterRegex = /[@$!%*?&]/;

        return (
            password.length >= minLength &&
            (password.match(atLeastOneCapitalLetterRegex) || []).length >= atLeastOneCapitalLetter &&
            (password.match(atLeastOneSmallLetterRegex) || []).length >= atLeastOneSmallLetter &&
            (password.match(atLeastOneNumberRegex) || []).length >= atLeastOneNumber &&
            (password.match(atLeastOneSpecialCharacterRegex) || []).length >= atLeastOneSpecialCharacter
        );
    };

    const isFirstLastNameValid = (name) => {
        const minLength = 3;
        const atLeastNameValidRegex = /[a-zA-Z]{3,}/;

        return (
            name.length >= minLength &&
            atLeastNameValidRegex.test(name)
        );
    };

    const isPhoneNoValid = (phoneNo) => {
        const length = 11;
        const phoneNoRegex = /^\d+$/;

        return (
            phoneNo.length === length &&
            phoneNoRegex.test(phoneNo)
        );
    };

    const handleChange = (eventTriggered) => {
        const { name, value } = eventTriggered.target;
        setUser({
            ...user,
            [name]: value,
        });
        validateInput(name, value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setError({ ...error, image: "" });
        } else {
            setImage(null);
            setError({ ...error, image: "Only image files are allowed." });
        }
    };

    const validateInput = (name, value) => {
        switch (name) {
            case 'firstName':
                setError({
                    ...error,
                    [name]: isFirstLastNameValid(value) ? "" : `First name should contain at least 3 characters`,
                });
                break;
            case 'lastName':
                setError({
                    ...error,
                    [name]: isFirstLastNameValid(value) ? "" : `Last name should contain at least 3 characters`,
                });
                break;
            case 'phoneNo':
                setError({
                    ...error,
                    [name]: isPhoneNoValid(value) ? "" : "Phone number must contain 11 digits",
                });
                break;
            case 'password':
                setError({
                    ...error,
                    [name]: isPasswordValid(value) ? "" : (
                        <>
                            Password should:<br />
                            - Be at least 6 characters<br />
                            - Contain at least 1 Capital Letter<br />
                            - Contain at least 1 Small Letter<br />
                            - Contain at least 1 Number<br />
                            - Contain at least 1 Special Character
                        </>
                    ),
                });
                break;
            default:
                break;
        }
    };

    const CreateAccount = () => {
        const UserRegisteredData = new FormData();
        Object.entries(user).forEach(([key, value]) => {
            UserRegisteredData.append(key, value);
        });
        UserRegisteredData.append("UserProfile", image);
        const { firstName, lastName, phoneNo, password } = user;
        if (isFirstLastNameValid(firstName) && isFirstLastNameValid(lastName) && isPhoneNoValid(phoneNo) && isPasswordValid(password) && image) {
            axios.put(`http://localhost:9002/Enthusiast/SignUpFlow2/${email}`, UserRegisteredData)
                .then((response) => {
                    toast.success(response.data.message);
                    setTimeout(() => {navigate("/UserSignIn");},2000)
                })
                .catch((error) => {
                    toast.error("Error Occured")
                    console.error("Getting error in sign up of user"+error)
                });
        } else {
            if (!image) setError({ ...error, image: "Please upload an image file." });
        }
    };

    return (
        <React.Fragment>
            <ToastContainer/>
            <div className="main-boxx">
                <div className="signIn-box">
                    <div className="signIn-content" style={{ alignSelf: 'flex-start', marginLeft: '19px' }}>
                        <img src="../Mail Sign Up Icon.svg" alt="Mail Icon" style={{ width: '73px', height: '73px' }} />
                        <h4>Let's Get You Started</h4>
                        <p style={{ width: 'auto' }}>First, let’s create your FitClub account with <span style={{ color: 'black', fontWeight: '400' }}>{email}</span></p>
                    </div>

                    <div className="signIn-content">
                        <input name="firstName" value={user.firstName} type="text" placeholder="First Name" onChange={handleChange} />
                        <p style={{ color: 'red', width: 'auto' }}>{error.firstName}</p>
                        <input name="lastName" value={user.lastName} type="text" placeholder="Last Name" onChange={handleChange} />
                        <p style={{ color: 'red', width: 'auto' }}>{error.lastName}</p>
                        <input name="password" value={user.password} type="password" placeholder="Password" onChange={handleChange} />
                        <p style={{ color: 'red', width: 'auto' }}>{error.password}</p>
                        <input name="phoneNo" value={user.phoneNo} type="tel" placeholder="Phone No" onChange={handleChange} />
                        <p style={{ color: 'red', width: 'auto' }}>{error.phoneNo}</p>
                        <input type="file" onChange={handleFileChange} />
                        <p style={{ color: 'red', width: 'auto' }}>{error.image}</p>
                    </div>

                    <button className="login-btn" onClick={CreateAccount}>Create Account</button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserSignUpFlow2;