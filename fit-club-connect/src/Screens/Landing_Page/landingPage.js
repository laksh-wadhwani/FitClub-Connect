import React, { useState } from "react";
import "./landingPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function LandingPage() {

  const [newsLetter, setNewsLetter] = useState("");

  const handleChange = eventTriggered => {
    setNewsLetter(eventTriggered.target.value);
  }

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

  const NewsLetter = () => {
    if(isEmailValid(newsLetter)){
      axios.post("http://localhost:9002/NewsLetter", {newsLetter})
      .then(response => {
        toast.success(response.data.message)
        setNewsLetter("")
      })
      .catch(error => {
        toast.error("Error Occured")
        console.error("Getting Erorr in saving newsletter email: "+error)
      })
    }
    else toast.error("Email Address should contain 3 letters with @")
  }

  return (
    <React.Fragment>
      <ToastContainer/>
      <div className="main-boxx">
        <div className="section1">
          <h3 className="section1-tagline">
            WHERE <span style={{ color: "#FF7A59" }}>FITNESS</span> <br />
            MEETS CONVENIENCE
          </h3>
        </div>

        <div className="section2">
          <div className="sections-heading-box">
            <div className="bar" />
            <h3 className="sections-heading">
              YOU FOCUS ON FITNESS, WE HANDLE THE REST
            </h3>
          </div>
          <img
            className="section2-picture"
            src="./section2.png"
            alt="A Boy doing Rope Ripping Exercise"
          />
          <div className="section2-text">
            <h4>List Your Gym On FitClub</h4>
            <p className="sections-description">Ready for a surge in fitness enthusiasts to experience your exceptional gym services?<br/>
              We've got a straightforward plan: showcase your offerings online, streamline membership processing, and connect with eager clients.<br/>
              Join us today to kick start our partnership and elevate your gym's success!</p>
              <Link style={{textDecoration:'none'}} to="./GymSignUpFlow1"><button className="startButton">Get Started</button></Link>
          </div>
          
        </div>

        <div className="section3">
          <div className="sections-heading-box">
            <div className="bar"/>
            <h3 className="sections-heading" style={{letterSpacing:'8px'}}>Find Us In These Cities</h3>
          </div>
          <div className="cities">
          <div className="cards">
            <img src="./Karachi Box.png" alt="Karachi"/>
            <Link style={{textDecoration:'none'}} to="/Karachi"><button style={{margin: "20px"}} className="citiesButton">Karachi</button></Link>
          </div>
          <div className="cards">
            <img src="./Hyd Box.png" alt="Hyderabad"/>
            <Link style={{textDecoration:'none'}} to="/Hyderabad"><button style={{margin: "20px"}} className="citiesButton">Hyderabad</button></Link>
          </div>
          <div className="cards">
            <img src="./Islamabad Box.png" alt="Islamabad"/>
            <Link style={{textDecoration:'none'}} to="/Islamabad"><button style={{margin: "20px"}} className="citiesButton">Islamabad</button></Link>
          </div>
          <div className="cards">
            <img src="./Lahore Box.png" alt="Lahore"/>
            <Link style={{textDecoration:'none'}} to="/Lahore"><button style={{margin: "20px"}} className="citiesButton">Lahore</button></Link>
          </div>
          </div>
        </div>

        <div className="section4">
          <img
            className="section4-picture"
            src="./section4.png"
            alt="A girl is practincing box fighting"
            style={{borderRadius:'8px'}}
          />
          <div className="section4-text">
            <h3 className="sections-heading">
              Discover how your fitness journey can begin with us
            </h3>
            <p className="sections-description">
              Embark on your fitness journey with us! Learn how our passion for
              health and wellness initiated a platform designed to transform
              your workout experience. Discover a community-driven space where
              fitness enthusiasts thrive and elevate their well-being
            </p>
            <Link style={{textDecoration:'none'}} to="./UserSignUpFlow1"><button className="startButton">Get Started</button></Link>
          </div>
        </div>

        <div className="landing-footer">
          <div className="footer-text">
            <div className="footer-tagline">
              <h3 className="sections-heading" style={{color:'white'}}>Elevate Your Fintess <span style={{color:'#FF7A59'}}>Journey</span> Today!</h3>
              <h6><img src="./Mail Icon.svg" alt="Mail Icon"/>fitclubconnect@gmail.com</h6>
            </div>
            <div className="quick-links">
              <h4>QUICK LINKS</h4>
              <ul>
                <Link style={{textDecoration: 'none'}} to="/AboutUs"><li>about us</li></Link>
                <Link style={{textDecoration:'none'}} to="/ContactUs"><li>contact us</li></Link>
              </ul>
            </div>
            <div className="newsLetter">
              <h4>newsletter sign up</h4>
              <div className="newsletter-box">
                <input name="newsLetter" value={newsLetter} placeholder="Enter Your Email" onChange={handleChange}/>
                <button className="startButton" onClick={NewsLetter}>Subscribe</button>
              </div>
              <div className="socialMedia-icons">
                <img src="./fb.svg" alt="Facebook"/>
                <img src="./insta.svg" alt="Instagram"/>
                <img src="./ln.svg" alt="Linked In"/>
              </div>
            </div>
          </div>
          <h6><img src='./Copyright SVG.svg' alt="Copyright"/>2024 FitClub Connect All Rights Reserved</h6>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LandingPage;
 