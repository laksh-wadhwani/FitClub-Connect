import React from "react";
import './Dashboard.css';
import { Link, useNavigate } from "react-router-dom";

const Dashboard = ({user, setLoginUser}) => {

    const navigate = useNavigate();
    const Logout = () => {
        setLoginUser("")
        navigate("/")
    }

    return(
        <React.Fragment>
            <div className="side-bar">
                <div className="logo-name">
                    <img src="./logo.svg" alt="FitClub Logo"/>
                    <h1>FitClub Connect</h1>
                </div>
                <hr className="logoName-underline"/>

                <div className="dashboard-buttons">
                    <Link to="/ClubApproval" style={{textDecoration:'none'}}><button>
                        <img src="./consumer approval.svg" alt="Fitness Club Approval Icon"/>
                    Fitness Club</button></Link>

                    <Link to="/PackageApproval" style={{textDecoration:'none'}}><button>
                        <img src="./consumer approval.svg" alt="Fitness Package Approval Icon"/>
                    Fitness Packages</button></Link>

                    <button onClick={Logout}>
                        <img src="./signout.svg" alt="Logout Icon"/>
                    Logout</button>
                </div>

                <div className="lower-admin-section">
                    <img src={user.adminProfile? `http://localhost:9002/Admin/${user.adminProfile}`:"./user.png"} alt="Admin Profile"/>
                    <div>
                        <h2 style={{fontSize:'1rem'}}>{`${user.firstName} ${user.lastName}`}</h2>
                        <h5 style={{fontWeight:'normal'}}>Admin</h5>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Dashboard