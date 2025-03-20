import React, { useState } from "react";
import "./navBar.css"
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({user, setLoginUser}) => {

    const navigate = useNavigate();
    const [signInDropdown, setSignIn] = useState(false)
    const [signUpDropdown, setSignUp] = useState(false);
    const [userMenuDropdown, setMenu] = useState(false)

    const IsSignInVisible = () => {
        setSignIn(!signInDropdown)
        setSignUp(false)
    }

    const IsSignUpVisible = () => {
        setSignUp(!signUpDropdown)
        setSignIn(false)
    }

    const IsUserMenuVisible = () => {
        setMenu(!userMenuDropdown)
    }

    const Logout = () => {
        setLoginUser({})
        navigate("/")
    }

    return(
        <React.Fragment>
            <div className="navBar">
                <div className="navBar-box">
                    <div className="logoText-box">
                        <Link to="/"><img src="../logo.svg" alt="Website Logo"/></Link>
                        <h2>Fitclub connect</h2>
                    </div>

                    <div className="sign-buttons">
                        {(user&&user._id)? 
                        <React.Fragment>
                            <div onClick={IsUserMenuVisible}>
                                <img src={`${user.UserProfile}`} alt="User Profile"/>
                                <label>Hello <span style={{color:"#FF7A59"}}>{user.firstName}</span></label>
                            </div>
                            <button onClick={Logout}>Logout</button>
                            <Link to={`/Cart/${user._id}`}><img src="../Cart.svg" alt="Cart Logo"/></Link>

                            {/* User Dropdown Menu */}
                            {userMenuDropdown?
                            <div className="sign-dropdown position1">
                                <Link to="/UserProfile" style={{width: "inherit"}}><button style={{color: 'black'}} onClick={() => setMenu(false)}>Profile</button></Link>
                                <Link to="/Receipts" style={{width: "inherit"}}><button style={{color: 'black'}} onClick={() => setMenu(false)}>Receipts</button></Link>
                            </div>
                            :null}
                        </React.Fragment>
                        :<React.Fragment>
                            <button onClick={IsSignInVisible}>Sign In</button>
                            <button onClick={IsSignUpVisible}>Sign Up</button>
                        </React.Fragment>}
                    </div>

                    {/* Sign In Dropdown */}
                    {signInDropdown?
                    <React.Fragment>
                        <div className="sign-dropdown position2">
                            <Link to="/GymSignIn" style={{width:'inherit'}}><button onClick={() => setSignIn(false)}>Club</button></Link>
                            <Link to="/UserSignIn" style={{width:'inherit'}}><button onClick={() => setSignIn(false)}>Enthusiast</button></Link>
                        </div>
                    </React.Fragment>:null}

                    {/* Sign Up Dropdown */}
                    {signUpDropdown? 
                    <React.Fragment>
                         <div className="sign-dropdown position3">
                            <Link to="/GymSignUpFlow1" style={{width:'inherit'}}><button onClick={() => setSignUp(false)}>Club</button></Link>
                            <Link to="/UserSignUpFlow1" style={{width:'inherit'}}><button onClick={() => setSignUp(false)}>Enthusiast</button></Link>
                        </div>
                    </React.Fragment>:null}
                </div>
            </div>
        </React.Fragment>
    )
}

export default NavBar