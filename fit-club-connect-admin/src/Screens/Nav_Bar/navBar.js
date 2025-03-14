import React from "react";
import "./navBar.css"
import { Link } from "react-router-dom";

const NavBar=()=>{
    return(
        <React.Fragment>
        <div className="navBar">
            <div className='navBar-box'>
               <Link to="/" style={{textDecoration:'none'}}><div className="logoText-box">
                    <img src="./logo.svg" alt="Website Logo"/>
                    <h2 style={{color:'black'}}>FitClub Connect</h2>
                </div></Link>
            </div>
        </div>
        </React.Fragment>
    );
}

export default NavBar