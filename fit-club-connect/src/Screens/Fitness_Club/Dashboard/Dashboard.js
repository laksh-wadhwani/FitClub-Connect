import React, { useState } from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = ({ gymUser, setGymUser }) => {
  const navigate = useNavigate();

  const Logout = () => {
    setGymUser({});
    navigate("/");
  };
  const [isOpen, setIsOpen] = useState(false);
  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };
  return (
    <React.Fragment>
      <div className="hamb">
      <button className="toggle-button" onClick={toggleSidebar}>
      <i className="fa-solid fa-bars"></i>
      </button>
      <h2>Dashboard</h2>
      </div>
      <div className={`side-bar ${isOpen ? "open" : "close"}`}>
        <div className="logo-text">
          <div>
            <img src="./logo.svg" alt="Website Logo" />
            <label>FitClub Connect</label>
            <button className="toggle-button2" onClick={toggleSidebar}>
            <i className="fa-solid fa-x"></i>
            </button>
          </div>
        </div>

        <div className="dashboard-buttons">
          <Link to="/ClubProfile">
            <button>
              <img src="./profile icon.png" alt="Upload Packages Icon" />
              Profile
            </button>
          </Link>

          <Link to="/UploadPackages">
            <button>
              <img src="./upload packages.png" alt="Upload Packages Icon" />
              Upload Packages
            </button>
          </Link>

          <Link to="/MyPackages">
            <button>
              <img src="./my packages.png" alt="Upload Packages Icon" />
              My Packages
            </button>
          </Link>

          <Link to="/PackageApprovals">
            <button>
              <img
                src="./consumer approval.svg"
                alt="Approvals Icon"
                style={{ filter: "invert(1" }}
              />
              Approvals
            </button>
          </Link>

          <Link to="/WorkoutVideos">
            <button>
              <img
                src="./workout.svg"
                alt="Workout Videos Icon"
                style={{ filter: "invert(1" }}
              />
              Workout Videos
            </button>
          </Link>

          <button onClick={Logout}>
            <img src="./logout.png" alt="Approvals Icon" />
            Logout
          </button>
        </div>

        <div className="user-info">
          <img
            src={`${gymUser?.gymProfile}`}
            alt="Gym Profile"
          />
          <label>Hello, {gymUser?.firstName}</label>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
