import React, { useState } from "react";
import "./clubProfile.css"
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BackendURL } from "../../../BackendContext";

const ClubProfile=({gymUser, setGymUser})=>{

    const API = BackendURL();
    const [updateUser, setUpdateUser] = useState({
        firstName: "",
        lastName: "",
        phoneNo: "",
        email: "",
        currentPass: "",
        newPass: "",
        cityName: "",
        gymName: "",
        address: "",
    });
    const [image, setImage] = useState();
    const [isButton, setIsButton] = useState(false);

    const handleChange = eventTriggered =>{
        const {name, value} = eventTriggered.target;
        setUpdateUser(previousState => ({
            ...previousState,
            [name]: value
        }));
        setIsButton(true);
    }

    const updateBasicInfo=()=>{
        const gymUpdatedData = new FormData();
        Object.entries(updateUser).forEach(([key,value]) => { gymUpdatedData.append(key,value) })
        gymUpdatedData.append("GymProfileUpdated",image)
        axios.put(`${API}/Club/UpdateClubDetails/${gymUser._id}`, gymUpdatedData)
        .then(response => {
            if(response.data.message === "Basic Info has been Updated Successfully"){
                toast.success(response.data.message);
                setGymUser(response.data.user);
                setIsButton(false);
            }
            else{
                toast.error(response.data.message)
            }
        })
    }

    const buttonClass = isButton? 'save-button':'save-button-gray';

    return(
        <React.Fragment>
            <ToastContainer/>
        <div className="main-box">
            <div className="my-profile-box">
                <h2 className="each-box-heading">My Profile</h2>
                {/* <label className="inputName-labels" style={{top: '-40px', left: '119px'}}>First Name</label> */}
                <label className="inputName-labels FN-labels">First Name</label>
                <input name="firstName" value={updateUser.firstName} className="input-fields short-fields margin-right" type="text" placeholder={gymUser?.firstName} onChange={handleChange}/>
                <label className="inputName-labels lN-label">Last Name</label>
                <input name="lastName" value={updateUser.lastName} className="input-fields short-fields" type="text" placeholder={gymUser?.lastName} onChange={handleChange}/>
                <label className="inputName-labels EM-lables">Email</label>
                <input name="email" value={updateUser.email} className="input-fields" type="email" placeholder={gymUser?.email} onChange={handleChange}/>
                <label className="inputName-labels CN-labels">Mobile No</label>
                <input name="phoneNo"value={updateUser.phoneNo} className="input-fields" type="tel" placeholder={gymUser?.phoneNo} onChange={handleChange}/>
                <button className={buttonClass} onClick={updateBasicInfo} disabled={!isButton}>Save</button>
                <div className="underline"/>
            </div>
            <div className="change-password-box">
                <h2 className="each-box-heading">Password</h2>
                <input name="currentPass" value={updateUser.currentPass} className="input-fields" type="password" placeholder="Current Password" onChange={handleChange}/>
                <input name="newPass" value={updateUser.newPass} className="input-fields" type="password" placeholder="New Password" onChange={handleChange}/>
                <button className={buttonClass} onClick={updateBasicInfo} disabled={!isButton}>Save</button>
                <div className="underline"/>
            </div>
            <div className="gym-information-box">
                <h2 className="each-box-heading">Gym Information</h2>
                <label className="inputName-labels" style={{top: '105px', left: '24px'}}>City Name</label>
                <input name="cityName" value={updateUser.cityName} className="input-fields" type="text" placeholder={gymUser?.cityName} onChange={handleChange}/>
                <label className="inputName-labels" style={{top: '201px', left: '24px'}}>Gym Name</label>
                <input name="gymName" value={updateUser.gymName} className="input-fields" type="text" placeholder={gymUser?.gymName} onChange={handleChange}/>
                <label className="inputName-labels" style={{top: '297px', left: '24px'}}>Address</label>
                <input name="address" value={updateUser.address} className="input-fields" type="text" placeholder={gymUser?.address} onChange={handleChange}/>
                <label className="inputName-labels" style={{top: '386px', left: '24px'}}>Gym Profile</label>
                <input className="input-fields" type="file" onChange={e => setImage(e.target.files[0])}></input>
                <button className={buttonClass} onClick={updateBasicInfo} disabled={!isButton}>Save</button>
                <div className="underline"/>
            </div>
        </div>
        </React.Fragment>
    );
}

export default ClubProfile