import './App.css';
import NavBar from './Screens/Nav_Bar/navBar';
import LandingPage from './Screens/Landing_Page/landingPage'
import GymSignIn from './Screens/Fitness_Club/Fitness_Sign/gymSignIn'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import GymSignUpFlow1 from './Screens/Fitness_Club/Fitness_Sign/gymSignUpFlow1';
import GymSignUpFlow2 from './Screens/Fitness_Club/Fitness_Sign/gymSignUpFlow2';
import GymSignUpFlow3 from './Screens/Fitness_Club/Fitness_Sign/gymSignUpFlow3';
import UserSignIn from './Screens/Fitness_Enthusiast/User_Sign/userSignIn';
import UserSignUpFlow1 from './Screens/Fitness_Enthusiast/User_Sign/userSignUpFlow1';
import UserSignUpFlow2 from './Screens/Fitness_Enthusiast/User_Sign/userSignUpFlow2';
import Dashboard from './Screens/Fitness_Club/Dashboard/Dashboard';
import { useEffect, useState } from 'react';
import ClubProfile from './Screens/Fitness_Club/Club_Profile/clubProfile'
import MyPackages from './Screens/Fitness_Club/My_Packages/myPackages'
import UploadPackages from './Screens/Fitness_Club/Upload_Packages/uploadPackages'
import PackageApprovals from './Screens/Fitness_Club/Package Approvals/packageApprovals'
import Karachi from './Screens/Fitness_Enthusiast/Cities/karachi'
import Lahore from './Screens/Fitness_Enthusiast/Cities/lahore'
import Islamabad from './Screens/Fitness_Enthusiast/Cities/islamabad'
import Hyderabad from './Screens/Fitness_Enthusiast/Cities/hyd'
import Packages from './Screens/Fitness_Enthusiast/Packages/packages'
import Cart from './Screens/Fitness_Enthusiast/Cart/cart'
import ContactUs from './Screens/Contact Us/contactUs'
import AboutUs from './Screens/About Us/aboutUs'
import Receipts from './Screens/Fitness_Enthusiast/Receipts/receipts';
import UserProfile from './Screens/Fitness_Enthusiast/User_Profile/userProfile'
import Workout from './Screens/Fitness_Club/Workout_Videos/workout';
import {BackendProvider} from "../src/BackendContext"
function App() {

  const [gymUser, setGymUser] = useState(
  JSON.parse(sessionStorage.getItem('gymUser')) || {}
  )

  useEffect( () => {
    if(gymUser&&gymUser._id) {sessionStorage.setItem('gymUser', JSON.stringify(gymUser))}
    else {sessionStorage.removeItem('gymUser')}
  },[gymUser])

  const [user, setLoginUser] = useState(
    JSON.parse(sessionStorage.getItem('user')) || {}
    )
  
    useEffect( () => {
      if(user&&user._id) {sessionStorage.setItem('user', JSON.stringify(user))}
      else {sessionStorage.removeItem('user')}
    },[user])

  return (
  <BackendProvider>
  <Router>
    {(gymUser&&gymUser._id)? 
    (<>
    <Dashboard gymUser={gymUser} setGymUser={setGymUser}/>
    <Routes>
      <Route exact path='/ClubProfile' element={<ClubProfile gymUser={gymUser} setGymUser={setGymUser}/>}/>
      <Route exact path='/MyPackages' element={<MyPackages gymUser={gymUser}/>}/>
      <Route exact path='/UploadPackages' element={<UploadPackages gymUser={gymUser}/>}/>
      <Route exact path='/PackageApprovals' element={<PackageApprovals gymUser={gymUser}/>}/>
      <Route exact path='WorkoutVideos' element={<Workout gymUser={gymUser}/>}/>
    </Routes>
    </>):
    (<>
    <NavBar user={user} setLoginUser={setLoginUser}/>
    <Routes>
    <Route exact path='/' element={<LandingPage/>}/>
      <Route exact path='/GymSignUpFlow1' element={<GymSignUpFlow1/>}/>
      <Route exact path='/GymSignUpFlow2/:email' element={<GymSignUpFlow2/>}/>
      <Route exact path='/GymSignUpFlow3/:email' element={<GymSignUpFlow3/>}/>
      <Route exact path='/GymSignIn' element={<GymSignIn setGymUser={setGymUser}/>}/>
      <Route exact path='/UserSignIn' element={<UserSignIn setLoginUser={setLoginUser}/>}/>
      <Route exact path='/UserSignUpFlow1' element={<UserSignUpFlow1/>}/>
      <Route exact path='/UserSignUpFlow2/:email' element={<UserSignUpFlow2/>}/>
      <Route exact path='/Karachi' element={<Karachi/>}/>
      <Route exact path='/Hyderabad' element={<Hyderabad/>}/>
      <Route exact path='/Lahore' element={<Lahore/>}/>
      <Route exact path='/Islamabad' element={<Islamabad/>}/>
      <Route exact path='/Packages/:id' element={<Packages user={user}/>}/>
      <Route exact path='/Cart/:id' element={<Cart user={user}/>}/>
      <Route exact path='/AboutUs' element={<AboutUs/>}/>
      <Route exact path='/ContactUs' element={<ContactUs/>}/>
      <Route exact path='/UserProfile' element={<UserProfile user={user} setLoginUser={setLoginUser}/>}/>
      <Route exact path='/Receipts' element={<Receipts user={user}/>}/>
    </Routes>
    </>)
    }
  </Router>
  </BackendProvider>
  );
}

export default App;
