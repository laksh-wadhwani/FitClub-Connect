import React from "react";
import './contactUs.css';

const ContactUs = () => {
    return(
        <React.Fragment>
            <div className="main-boxx" style={{paddingBottom: '24px'}}>
                <div className="contactus-box">
                    <div style={{display:'flex', flexDirection:'column', gap:'40px', zIndex:'1'}}>
                        <div className="contact-form-text">
                            <h3>get in <span style={{color:'#FF7A59'}}>touch</span></h3>
                            <p>Ask us anyting! We're here to help</p>
                        </div>
                        <div className="contact-form-fields">
                            <input type="text" placeholder="Name"/>
                            <input type="email" placeholder="Email"/>
                            <textarea placeholder="Write Your Message"/>
                            <button>Send</button>
                        </div>
                    </div>
                    <div className="side-contactus-box">
                    <img src="./contact-map.png" alt="Map Pin Point"/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ContactUs