import React from "react";
import "./aboutUs.css";

const AboutUs = () => {
  return (
    <React.Fragment>
      <div className="main-boxx" style={{ paddingBottom: "16px", gap:'5rem'}}>
        <div className="aboutus-heading">
          <h2 clas>
            we're here to <br />{" "}
            <span style={{ color: "#FF7A59" }}>guarantee your success</span>
          </h2>
          <hr />
        </div>

        <div className="aboutus-content">
          <div className="actual-aboutus-content">
            <p> Experience the future of fitness with FitClub Connect,
            revolutionizing how gyms and fitness enthusiasts connect. For users,
            it's a user-friendly haven, effortlessly comparing gym offerings and
            making informed choices. Gym owners enjoy streamlined management and
            heightened visibility, thanks to our centralized platform.</p>
          </div>
          <img src="./AboutUsPicture.png" alt="About Us Section Visuals" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default AboutUs;
