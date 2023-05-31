import React, { useState, useEffect } from 'react';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NavBar from './NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate} from 'react-router-dom';
import {auth, db, logout,fetchInfoUser, removeUser} from "../firebase";

import {query, collection, getDocs, where} from "firebase/firestore"




import "./Settings.css";
import { JsonRequestError } from '@fullcalendar/core';


function Settings() {

  const [showRemoveAccount, setShowRemoveAccount] = useState(false);
  const [showAccessInformation, setShowAccessInformation] = useState(false);
  const [removeAccountQuestion, setAccountQuestion] = useState('');
  const [happensNextText, setHappensNextText] = useState('');
  const [happensNextAccess, setHappensNextAccess] = useState('');
  const [informationUser, setInformationUser] = useState('');

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);


  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    }catch(err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate ("/");
    fetchUserName();
  }, [user, loading]);


  const btnRemoveAccount = () =>{
    setHappensNextText("");
    setShowRemoveAccount(!showRemoveAccount);
   };

  const btnAccessInformation = () =>{
    setHappensNextAccess('');
    setShowAccessInformation(!showAccessInformation);

    let newText = fetchInfoUser(user.uid).then((response) => {
      let jsonPretty =(JSON.stringify(response,null,4))
      setInformationUser(jsonPretty);
    });
   };

  const handleChangeTetx = (event) => {
    setAccountQuestion(event.target.value);
  };

 
  const handleSubmit = (e) =>{
    e.preventDefault();
  };

  const SubmitRemoveAccount = () => {
    let checkAgainst = "Remove account"
    if(removeAccountQuestion ==checkAgainst){
      removeUser();
      logout();
      
      //setHappensNextText("Your account will be removed in the next 24 hours")
      
    }else{
      setHappensNextText("The account will not be removed")

    }
    

  };
  
  
  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#307672',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#1a3c40',
      },
      

    },
  });


    return (
      <div className='App'>
          <div className='backgroundApp'>
            <div className='topHome'> 

            <div className='loginButton'>
          <ThemeProvider theme={theme}>
              <Button size ='15px' color="primary" variant="contained" startIcon={<AccountCircle />} onClick={logout} className='logout__btn'>
                Log out 
              </Button>
            </ThemeProvider>
        </div>
        
              
              <div className='header'>
              <h1 >MealMate</h1>
              </div>
            


              <div className='navbar'>
                {/* Render the NAvBar component */}
                <NavBar />
              </div>
            </div>
          
            <div className='overlayHomePage'>
              <div className='btnSettings'>
              <ThemeProvider theme={theme}>
                    <Button onClick={btnRemoveAccount} size ='15px' color="primary" variant="contained" startIcon={<PersonRemoveIcon />}>
                      Remove your account
                    </Button>

                    <Button onClick={btnAccessInformation} size ='15px' color="primary" variant="contained" startIcon={<FolderSharedIcon />}>
                      Access your information 
                    </Button>
                  </ThemeProvider>
              </div>

              <div className='textSettings'>
              {showRemoveAccount && 
                <div>
                  <p>
                    Remove account 
                  </p>
          
                <p>
                Do you really want to remove your account?
                </p>
                <form  onSubmit={handleSubmit}>
                  <div className='submitForm'>

                 
                    <label className='textForm' > If Yes, write "Remove account: " </label>
                    <input onChange={handleChangeTetx} type='text'></input>
                    <ThemeProvider theme={theme}>
                    <Button onClick={SubmitRemoveAccount} size ='15px' color="primary" variant="contained" startIcon={<CheckIcon />}>
                     Submit
                    </Button>
                    </ThemeProvider>
                    </div>
                </form>
                <p>
                  {happensNextText}
                </p>
                
                </div>
                  }
                  {showAccessInformation && showRemoveAccount  &&
                  <p className="fillerParagrah">  </p>
                  }
              </div>

              <div className='textSettings'>
                {showAccessInformation && 
              
                <div>
                  <p>
                   Information is gathered
                   {informationUser}
                  </p>
                 
                
                <p>
                  {happensNextAccess}
                </p>

                </div>

                }
              </div>
            
            </div>
          </div>

          
      </div>
    );
}

export default Settings;