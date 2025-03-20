import React, { useState } from "react";
import "./gymSignUp.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const GymSignUpFlow2 = () => {
  const {email} = useParams();
  const navigate = useNavigate();
  const [isNext, setIsNext] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    password: "",
    gymName: "",
    cityName: "",
    address: "",
    gymEmail: "",
    gymPhoneNo: ""
  })
  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    password: '',
    phoneNo: '' ,
    gymEmail: '',
    gymPhoneNo: '',
    image: ''
})
const[image, setImage] = useState();

    const isPasswordValid = password => {
      const minLength = 6;
      const atLeastOneCapitalLetter = 1;
      const atLeastOneSmallLetter = 1;
      const atLeastOneNumber = 1;
      const atLeastOneSpecialCharacter = 1;

      const atLeastOneCapitalLetterRegex = /[A-Z]/;
      const atLeastOneSmallLetterRegex = /[a-z]/;
      const atLeastOneNumberRegex = /\d/;
      const atLeastOneSpecialCharacterRegex = /[@$!%*?&]/;

      return (
          password.length >= minLength &&
          (password.match(atLeastOneCapitalLetterRegex) || []).length >= atLeastOneCapitalLetter &&
          (password.match(atLeastOneSmallLetterRegex) || []).length >= atLeastOneSmallLetter &&
          (password.match(atLeastOneNumberRegex) || []).length >= atLeastOneNumber &&
          (password.match(atLeastOneSpecialCharacterRegex) || []).length >= atLeastOneSpecialCharacter
      );
  }

  const isFirstLastNameValid = name => {
      const minLength = 3;
      const atLeastNameValidRegex = /[a-zA-Z]{3,}/;

      return(
          name.length >= minLength &&
          atLeastNameValidRegex.test(name)
      );
  };

  const isPhoneNoValid = phoneNo => {
    const length = 11;
    const phoneNoRegex = /^\d+$/;

    return (
        phoneNo.length === length &&
        phoneNoRegex.test(phoneNo)
    );
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

const validateInput = (name, value) => {
    switch(name){
        case 'firstName':
            setError({
                ...error,
                [name]: isFirstLastNameValid(value)? "" : `First name should contain at least 3 characters`
            });
            break;
        case 'lastName':
            setError({
                ...error,
                [name]: isFirstLastNameValid(value)? "" : `Last name should contain at least 3 characters`
            });
            break;
        case 'email':
          setError({
            ...error,
            [name]: isEmailValid(value)? "": "Email Should contain t least 3 character and @ sign"
          });
          break;
        case 'phoneNo':
            setError({
                ...error,
                [name] : isPhoneNoValid(value)? "" : "Phone number must contain 11 digits"
            });
            break;
            case 'password':
            setError({
                ...error,
                [name]: isPasswordValid(value) ? "" : (
                <>
                    Password should:<br />
                        - Be at least 6 characters<br />
                        - Contain at least 1 Capital Letter<br />
                        - Contain at least 1 Small Letter<br />
                        - Contain at least 1 Number<br />
                        - Contain at least 1 Special Character
               </>)
            });
            break;
        default: 
            break;
    }
}

const handleChange = eventTriggered => {
  const {name, value} = eventTriggered.target;
  setUser({
    ...user,
    [name]:value
  })
  validateInput(name, value);
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
      setImage(file);
      setError({ ...error, image: "" });
  } else {
      setImage(null);
      setError({ ...error, image: "Only image files are allowed." });
  }
};


  const Next = () => {
    setIsNext(true)
  }

  const CreateAccount = () => {
    const gymRegistereData = new FormData();
    Object.entries(user).forEach(([key, value]) => {gymRegistereData.append(key,value)})
    gymRegistereData.append("GymProfile",image)
    const {firstName, lastName,phoneNo, password, gymName, cityName, address, gymEmail, gymPhoneNo} = user;
    if(isFirstLastNameValid(firstName) && isFirstLastNameValid(lastName) && isPhoneNoValid(phoneNo) && isPasswordValid(password) && gymName && cityName && address && gymEmail && gymPhoneNo && image){
      axios.put(`https://fit-club-connect-backend.vercel.app/Club/SignUpFlow2/${email}`, gymRegistereData)
      .then(response => {
        toast.success(response.data.message)
        navigate(`/GymSignUpFlow3/${email}`)
      })
      .catch(error => {
        console.error("Getting Error During Club Sign Up: "+error)
      })
    }
    else {
      toast.error("Please fill the validations")
      if (!image) setError({ ...error, image: "Please upload an image file." });
  }
  }

  return (
    <React.Fragment>
      <ToastContainer/>
      <div
        className="main-boxx"
        style={{ gap: 0, alignItems: "normal", height: "63vw" }}
      >
        <div className="gym-signUp">
          <div className="signUp-bg" />
          <div className="signUp-text">
            <h4>
              Boost your gym's success with{" "}
              <span style={{color:"#FF7A59"}}>fitclub connect</span>!
            </h4>
            <p>
              Join now and enhance your revenue with the leading fitness
              platform FitClub Connect. Sign up today and unlock a world of
              opportunities for your gym or studio.
            </p>
          </div>
          <div className="signUp-box">
                <div style={{width: "270px", gap: 0, alignSelf: "flex-start",marginLeft: "19px"}}>
                  <img src="../Mail Sign Up Icon.svg" alt="Mail Icon" style={{ marginLeft: "21px" }}/>
                  <h4>Let's Get You Started!</h4>
                  <p> First, let’s create your FitClub account with <span style={{color:"black", fontWeight:'400'}}>{email}</span></p>
                </div>
                {isNext? 
                (<React.Fragment>
                    <label>
                      <span>User Information</span>
                      <span>-----</span>
                      <span style={{ color: "black" }}>Fitness Club Information</span>
                    </label>

                    <div>
                      <input name="gymName" value={user.gymName} type="text" placeholder="Fitness Club Name" onChange={handleChange}/>
                      <input name="cityName" value={user.cityName} type="text" placeholder="City" onChange={handleChange}/>
                      <input name="address" value={user.address} type="text" placeholder="Address" onChange={handleChange}/>
                      <input name="gymEmail" value={user.gymEmail} type="email" placeholder="Fitness Club Email" onChange={handleChange}/>
                      <input name="gymPhoneNo" value={user.gymPhoneNo} type="tel" placeholder="Fitness Club Phone No" onChange={handleChange}/>
                      <input type="file" onChange={handleFileChange} />
                      <p style={{ color: 'red', width: 'auto' }}>{error.image}</p>
                    </div>

                    <button onClick={CreateAccount}>Create Account</button>
                </React.Fragment>):
                (<React.Fragment>
                  <label>
                    <span style={{ color: "black" }}>User Information</span>
                    <span>-----</span>
                    <span>Fitness Club Information</span>
                  </label>

                  <div>
                    <input name="firstName" value={user.firstName} type="text" placeholder="First Name" onChange={handleChange}/>
                    {error.firstName && <p style={{color:'red'}}>{error.firstName}</p>}
                    <input name="lastName" value={user.lastName} type="text" placeholder="Last Name" onChange={handleChange}/>
                    {error.lastName && <p style={{color:'red'}}>{error.lastName}</p>}
                    <input name="phoneNo" value={user.phoneNo} type="tel" placeholder="Phone No" onChange={handleChange}/>
                    {error.phoneNo && <p style={{color:'red'}}>{error.phoneNo}</p>}
                    <input name="password" value={user.password} type="password" placeholder="Passowrd" onChange={handleChange}/>
                    {error.password && <p style={{color:'red'}}>{error.password}</p>}
                  </div>

                  <button onClick={Next}>Next</button>
                </React.Fragment>)}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GymSignUpFlow2;
