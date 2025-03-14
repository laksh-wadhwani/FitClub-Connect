import React, { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Screens/Nav_Bar/navBar";
import SignUp from "./Screens/Sign_Up/signUp";
import SignIn from "./Screens/Sign_In/signIn"
import Dashboard from "./Screens/Dashboard/Dashboard";
import Home from "./Screens/Home/home";
import ClubApproval from "./Screens/Fitness_Club_Approval/clubApproval";
import PackageApproval from "./Screens/Package_Approval/packageApproval";

const App = () => {

  const [user, setLoginUser] = useState(
    JSON.parse(localStorage.getItem('user')) || {}
    )
  
    useEffect( () => {
      if(user&&user._id) {localStorage.setItem('user', JSON.stringify(user))}
      else {localStorage.removeItem('user')}
    },[user])

  return(
    <Router>
      {user&&user._id?
       (
       <React.Fragment>
        <Dashboard user={user} setLoginUser={setLoginUser}/>
          <Routes>
            <Route exact path="/Home" element={<Home/>}/>
            <Route exact path="/ClubApproval" element={<ClubApproval user={user}/>}/>
            <Route exact path="/PackageApproval" element={<PackageApproval user={user}/>}/>
          </Routes>
       </React.Fragment>
       )
       :
       (
        <React.Fragment>
          <NavBar/>
            <Routes>
              <Route exact path="/" element={<SignIn setLoginUser={setLoginUser}/>}/>
              <Route exact path="/SignUp" element={<SignUp/>}/>
            </Routes>
        </React.Fragment>
       )}
    </Router>
  )
}

export default App;