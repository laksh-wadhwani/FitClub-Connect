import React, { useState } from "react";
import "./userProfile.css"
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BackendURL } from "../../../BackendContext";

const UserProfile = ({user, setLoginUser}) => {

    const API = BackendURL();
    const [updatedUser, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        currentPass: "",
        newPass: ""
    })
    const [file, setFile] = useState()

    const handleChange = eventTrigerred => {
        const {name, value} = eventTrigerred.target
        setUser({
            ...updatedUser,
            [name]:value
        })
    }

    const Save = userID => {
        const userUpdatedData = new FormData();
        Object.entries(updatedUser).forEach(([key,value]) => { userUpdatedData.append(key,value) })
        userUpdatedData.append("UserProfileUpdated",file)
        axios.put(`${API}/Enthusiast/UpdateUserDetails/${userID}`, userUpdatedData)
        .then(response => {
            if(response.data.message === "Basic Info has been Updated Successfully"){
                toast.success(response.data.message);
                setLoginUser(response.data.user)
            }
            else{
                toast.error(response.data.message)
            }
        })
        .catch(error => {
            toast.success("Error Occured")
            console.log("Error Occured in Updating User Profile"+error)
        })
    }

    return(
        <React.Fragment>
            <ToastContainer/>
            <div className="main-boxx" style={{paddingBottom:'16px'}}>
                <div className="user-portal-section">
                    <div className="section">
                        <h2 className="each-box-heading">Profile</h2>
                        <label className="inputName-labels" style={{position:'relative' ,top:'1.5rem', left: '1rem'}}>First Name</label>
                        <input name="firstName" value={updatedUser.firstName} className="input-fields" type="text" placeholder={user.firstName} onChange={handleChange}/>
                        <label className="inputName-labels" style={{position:'relative' ,top:'1.5rem', left: '1rem'}}>Last Name</label>
                        <input name="firstName" value={updatedUser.lastName} className="input-fields" type="text" placeholder={user.lastName} onChange={handleChange}/>
                        <label className="inputName-labels" style={{position:'relative' ,top:'1.5rem', left: '1rem'}}>Email</label>
                        <input name="firstName" value={updatedUser.email} className="input-fields" type="email" placeholder={user.email} onChange={handleChange}/>
                        <label className="inputName-labels" style={{position:'relative' ,top:'1.5rem', left: '1rem'}}>Password</label>
                        <input name="firstName" value={updatedUser.phoneNo} className="input-fields" type="tel" placeholder={user.phoneNo} onChange={handleChange}/>
                        <label className="inputName-labels" style={{position:'relative' ,top:'1.5rem', left: '1rem'}}>User Profile</label>
                        <input className="input-fields" type="file" onChange={e => setFile(e.target.files[0])}/>
                        <button onClick={() => Save(user._id)}>Save</button>
                    </div>
                    
                    <div className="section">
                        <h2 className="each-box-heading">Password</h2>
                        <input name="currentPass" value={updatedUser.currentPass} className="input-fields" type="password" placeholder="Current Password" onChange={handleChange}/>
                        <input name="newPass" value={updatedUser.newPass} className="input-fields" type="password" placeholder="New Password" onChange={handleChange}/>
                        <button onClick={() => Save(user._id)}>Save</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserProfile