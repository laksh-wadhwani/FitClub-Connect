import React, { useEffect, useState } from "react";
import "./packageApproval.css";
import axios from "axios";

const PackageApproval = ({ user }) => {
  const [refresh, setRefresh] = useState(false)
  const [isReject, setIsReject] = useState(false);
  const [packageDetails, setPackageDetails] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [overAllPackageDetails, setOverAllPackageDetails] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9002/Admin/GetPackageDetailsForApproval")
      .then((response) => setPackageDetails(response.data))
      .catch((error) =>
        console.error("Error in getting package details for approval" + error)
      );

    axios
      .get("http://localhost:9002/Admin/GetOverallPackageDetails")
      .then((response) => setOverAllPackageDetails(response.data))
      .catch((error) =>
        console.error("Getting Error in OverAll Package Details" + error)
      );
  }, [refresh]);

  const Approve = (packageID) => {
    axios
      .put(`http://localhost:9002/Admin/PackageApproval/${packageID}`)
      .then((response) => {
        alert(response.data.message)
        setRefresh(!refresh)
      })
      .catch((error) => console.error("Getting Error in Package Approval" + error));
  };

  const Reject = (packageID, adminID) => {
    axios
      .post(`http://localhost:9002/Admin/PackageRejection/${packageID}/${adminID}`, {
        remarks: remarks,
      })
      .then((response) => {
        alert(response.data.message)
        setRefresh(!refresh)
      })
      .catch((error) =>
        console.error("Getting error in package rejection" + error)
      );
  };

  return (
    <React.Fragment>
      <div className="main-box" style={{ width: "81vw", float: "right" }}>
        <div className="stats">
          <div>
            <h2>{overAllPackageDetails.ApprovedPackagesLength}</h2>
            <p>Approved Packages</p>
          </div>
          <hr />
          <div>
            <h2>{overAllPackageDetails.RejectedPackagesLength}</h2>
            <p>Rejected Packages</p>
          </div>
          <hr />
          <div>
            <h2>{packageDetails?.length}</h2>
            <p>Pending Approvals</p>
          </div>
        </div>

        <div className="total-clubs">
          <h2>Total Packages</h2>
          <div className="club-history-box">
            {overAllPackageDetails?.AllPackages?.map((packages) => (
              <div className="actual-history" key={packages._id}>
                <img
                  src={
                    packages.packageProfile
                      ? `http://localhost:9002/ClubPackages/${packages.packageProfile}`
                      : "./titan.png"
                  }
                  alt="package profile"
                />
                <div>
                  <h3>{packages.packageName}</h3>
                  <h5 style={{ fontWeight: "400" }}>
                    {packages.gymID ? packages.gymID.gymName : "Gym not available"}
                  </h5>
                </div>
                <p>{packages.adminRemarks ? packages.adminRemarks : "Approved"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="total-clubs" style={{ height: "auto" }}>
          <h2>Package Approvals</h2>
          <div className="approvals-box">
            {packageDetails.length === 0 ? (
              <p>There are no packages for approval</p>
            ) : (
              <React.Fragment>
                {packageDetails?.map((packages) => (
                  <div className="package-box" key={packages._id}>
                    {isReject === packages._id ? (
                      <React.Fragment>
                        <textarea
                          placeholder="Remarks"
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                        <button
                          style={{ alignSelf: "center" }}
                          onClick={() => Reject(packages._id, user._id)}
                        >
                          Reject
                        </button>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <img
                          src={
                            packages.packageProfile
                              ? `http://localhost:9002/ClubPackages/${packages.packageProfile}`
                              : "./titan.png"
                          }
                          alt="Package Profile"
                        />
                        <div style={{ marginTop: "-8px" }}>
                          <h3>{packages.packageName}</h3>
                          <h5 style={{ fontWeight: "400" }}>
                            {packages.gymID ? packages.gymID.gymName : "Gym not available"}
                          </h5>
                        </div>

                        <div>
                          <h5>
                            Price: <span>{packages.price}</span>
                          </h5>
                          <h5>
                            Duration: <span>{packages.duration}</span>
                          </h5>
                          <h5>Description:</h5>
                          <p>{packages.description}</p>
                        </div>

                        <div style={{ flexDirection: "row", gap: "8px" }}>
                          <button onClick={() => Approve(packages._id)}>Approve</button>
                          <button onClick={() => setIsReject(packages._id)}>Reject</button>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                ))}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PackageApproval;
