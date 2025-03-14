import React, { useEffect, useState } from "react";
import './clubApproval.css';
import axios from "axios";

const ClubApproval = ({user}) => {

    const [refresh, setRefresh] = useState(false)
    const [isReject, setIsReject] = useState(null)
    const [clubDetails, setClubDetails] = useState();
    const [remarks, setRemarks] = useState("");
    const [overAllClubDetails, setOverAllClubDetails] = useState()
    

    useEffect(()=>{
        axios.get("http://localhost:9002/Admin/GetClubDetailsForApproval")
        .then(response => { 
            setClubDetails(response.data); 
        })
        .catch(error => console.log(error))

        axios.get("http://localhost:9002/Admin/GetOverallClubDetails")
        .then(response => setOverAllClubDetails(response.data))
        .catch(error => console.log(error))
    },[refresh])

    const Approve = clubID => {
        axios.put(`http://localhost:9002/Admin/ClubApproval/${clubID}`)
        .then(response => {
            alert(response.data.message)
            setRefresh(!refresh)
        })
        .catch(error => alert(error.data.message))
    }

    const Reject = (gymID, adminID) => {
        axios.post(`http://localhost:9002/Admin/ClubRejection/${gymID}/${adminID}`,{remarks:remarks})
        .then(response => {
            alert((response.data.message))
            setRefresh(!refresh)
        })
        .catch(error => console.log(error))
    }

    return(
        <React.Fragment>
            <div className="main-box" style={{width:'81vw', float:'right'}}>
                <div className="stats">
                    <div>
                        <h2>{overAllClubDetails?.ApprovedClubsLength}</h2>
                        <p>Approved Club's</p>
                    </div>
                    <hr/>
                    <div>
                        <h2>{overAllClubDetails?.RejectedClubsLength}</h2>
                        <p>Rejected Club's</p>
                    </div>
                    <hr/>
                    <div>
                        <h2>{clubDetails?.length}</h2>
                        <p>Pending Approvals</p>
                    </div>
                </div>

                <div className="total-clubs">
                    <h2>Total Clubs</h2>
                    <div className="club-history-box">
                        {overAllClubDetails?.AllClubs?.map(AllClub => (
                            <div className="actual-history" key={AllClub._id}>
                                <img src={AllClub.gymProfile? (`http://localhost:9002/Club/${AllClub.gymProfile}`):("./titan.png")} alt="Gym profile"/>
                                <h3>{AllClub.gymName}</h3>
                                <p>{AllClub.adminRemarks? AllClub.adminRemarks:"Approved"}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="total-clubs" style={{height:'auto'}}>
                    <h2>Club Approvals</h2>
                    <div className="approvals-box">
                        {clubDetails?.length===0? (<p>There are no approvals pending</p>)
                        :
                        (<React.Fragment>
                            {clubDetails?.map(club => (
                            <div className="package-box" key={club._id}>
                                {isReject===club._id? 
                                (
                                <React.Fragment>
                                        <textarea placeholder="Remarks" onChange={e => setRemarks(e.target.value)}/>
                                        <button style={{alignSelf:'center'}} onClick={() => Reject(club._id, user._id)}>Reject</button>
                                </React.Fragment>)
                                :
                                (<React.Fragment>
                                        <img src={club.gymProfile? (`http://localhost:9002/Club/${club.gymProfile}`):("./titan.png")} alt="Club Profile"/>
                                        <div style={{marginTop:'-8px'}}>
                                            <h3>{club.gymName}</h3>
                                        </div>

                                        <div>
                                            <h5>Owner: {club.firstName}</h5>
                                            <h5>City: {club.cityName}</h5>
                                            <h5>Address:</h5>
                                            <p>{club.address}</p>
                                        </div>

                                        <div style={{flexDirection:'row', gap:'8px'}}>
                                            <button onClick={() => Approve(club._id)}>Approve</button>
                                            <button onClick={() => setIsReject(club._id)}>Reject</button>
                                        </div>
                                </React.Fragment>)}
                            </div>
                        ))}
                        </React.Fragment>)}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ClubApproval