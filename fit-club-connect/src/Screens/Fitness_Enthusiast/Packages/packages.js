import React, { useState, useEffect } from "react";
import "./packages.css";
import Modal from "react-modal";
import axios from "axios";
import { BackendURL } from "../../../BackendContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Packages = ({user}) => {

  const API = BackendURL();
  const navigate = useNavigate();
  const location = useLocation();
  const { clubDetails } = location.state || {};
  const { id } = useParams();
  const IsSignedIn = (user&&user._id)? true:false
  const [modalIsOpen, setIsOpen] = useState(false);
  const [packageDetials, setDetails] = useState();

  useEffect(() => {
    axios
      .get(`${API}/Package/GetPackageDetails/${id}`)
      .then((response) => setDetails(response.data));
  }, [id]);

  const OpenModal = (packageID) => {
    setIsOpen(packageID);
  };

  const CloseModal = () => {
    setIsOpen(false);
  };

  const HandleSubscribe = packageId => {
    if(IsSignedIn){
      axios.post(`${API}/Cart/AddToCart/${user._id}/${packageId}/${id}`)
      .then(response => {
        toast.success(response.data.message)
        setIsOpen(false)
      })
    }
    else{
      toast.error("Please Sign In First")
      setTimeout(() => {navigate("/UserSignIn")},2000)
    }
  }

  return (
    <React.Fragment>
      <ToastContainer/>
      <div
        className="main-boxx"
        style={{ paddingBottom: "16px", gap: "3.5rem" }}
      >
        <div className="gym-info-box">
          <img
            src={`${clubDetails?.gymProfile}`}
            alt="Gym Profile"
          />
          <div className="info-box-details">
            <label style={{ fontSize: "xxx-large", fontWeight: "700", letterSpacing:'5px', textTransform:'uppercase' }}>
              {clubDetails?.gymName}
            </label>
            <div>
              <img src="../location icon.svg" alt="Gym Address SVG" />
              <label>{clubDetails?.address}</label>
            </div>
            <div>
              <img src="../phone icon.svg" alt="Gym Phone SVG" />
              <label>{clubDetails?.gymPhoneNo}</label>
            </div>
            <div>
              <img
                style={{ filter: "invert(0)" }}
                src="../Mail Icon.svg"
                alt="Gym Mail SVG"
              />
              <label>{clubDetails?.gymEmail}</label>
            </div>
          </div>
        </div>

        <div className="package-display-box">
          {packageDetials?.length ? (
            <>
              {packageDetials?.map((details) => (
                <React.Fragment>
                  <div
                    className="package-card"
                    onClick={() => OpenModal(details._id)}
                    key={details._id}
                  >
                    <img
                      src={details.packageProfile? `${details.packageProfile}`:"../NoImage.jpg"}
                      alt="Package Profile"
                    />
                    <h3>{details.packageName}</h3>
                    <div>
                      <span>{details.duration}</span>
                      <span style={{ color: "#FF7A59", fontWeight: "700" }}>
                        Rs. {details.price}
                      </span>
                    </div>
                    <button className="subscribe-button">Subscribe</button>
                  </div>
                  <Modal
                    isOpen={modalIsOpen === details._id}
                    onRequestClose={CloseModal}
                    className="package-description"
                    overlayClassName="package-description-overlay"
                  >
                    <img
                      src={details.packageProfile? `${details.packageProfile}`:"../NoImage.jpg"}
                      alt="Package Profile"
                    />
                    <div className="package-basic-info">
                      <h3>{details.packageName}</h3>
                      <span style={{ color: "grey", fontSize: "medium" }}>
                        {details.duration}
                      </span>
                      <span
                        style={{
                          color: "#FF7A59",
                          fontWeight: "700",
                          fontSize: "medium",
                        }}
                      >
                        Rs. {details.price}
                      </span>
                    </div>
                    <div className="package-description-info">
                      <label style={{ fontSize: "large", fontWeight: "600" }}>
                        Description
                      </label>
                      <p>{details.description}</p>
                    </div>
                    <button className="subscribe-button" onClick={() => HandleSubscribe(details._id)}>Subscribe</button>
                  </Modal>
                </React.Fragment>
              ))}
            </>
          ) : (
            <p>There are no packages listed in this club</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Packages;
