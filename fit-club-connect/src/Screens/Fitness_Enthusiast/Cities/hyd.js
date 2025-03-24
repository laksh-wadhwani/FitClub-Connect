import React, { useEffect, useState } from "react";
import './cities.css';
import axios from "axios";
import BackendURL from "../../../BackendContext"
import { useNavigate } from "react-router-dom";

const Hyderabad=()=>{

    const API = BackendURL();
    const navigate = useNavigate();
    const [gymDetails, setGymDetails] = useState([]);
    
    useEffect(()=>{
        axios.get(`${API}/Club/GetClubDetails`)
        .then(response => { 
            const filteredGyms = response.data.filter(gym => gym.cityName === 'hyderabad')
            setGymDetails(filteredGyms); 
        })
    },[])

    const HandleClubClick = details => {
        navigate(
            `/Packages/${details._id}`,
            {state: {clubDetails : details}}
        )
    }

    return(
        <React.Fragment>
            <div className="main-boxx">
                <div className="cityLine-mainBox">
                    <h1 className="cityLine" style={{letterSpacing:0}}>Hyderabad's Best <span style={{color:"#FF7A59"}}>Fitness</span> Clubs</h1>
                </div>

                {gymDetails.length? 
                <React.Fragment>
                    <div className="fitnessBoxes">
                    {gymDetails?.map(details => (
                        <div className="gymRender" key={details._id} onClick={() => HandleClubClick(details)}>
                            <img className="gymRender-picture" src={`${details.gymProfile}`} alt="Gym's Profile"/>
                            <h2 className="gymRender-name">{details.gymName}</h2>
                        </div>  
                    ))}
                </div>
                </React.Fragment>:<p>There are no clubs/gyms listed in this city</p>}

            </div>
        
        </React.Fragment>
    );
}

export default Hyderabad