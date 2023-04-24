import React, { useState } from 'react';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NavBar from './NavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FolderSharedIcon from '@mui/icons-material/FolderShared';



function Settings() {

  const [showRemoveAccount, setShowRemoveAccount] = useState(false);
  const [showAccessInformation, setShowAccessInformation] = useState(false);
  const [removeAccountQuestion, setAccountQuestion] = useState('');
  const [happensNextText, setHappensNextText] = useState('');
  const [emailText, setEmailText] = useState('')
  const [happensNextAccess, setHappensNextAccess] = useState('')



  const btnLogIn = () =>{
   window.alert("log in");
  };

  const btnRemoveAccount = () =>{
    setHappensNextText("");
    setShowRemoveAccount(!showRemoveAccount);
   };

  const btnAccessInformation = () =>{
    setHappensNextAccess('');
    setShowAccessInformation(!showAccessInformation);
   };

  const handleChangeTetx = (event) => {
    setAccountQuestion(event.target.value);
    
  };

  const handleChangeEmailText = (event) => {
    setEmailText(event.target.value);
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
  };

  const sumbitAccessInformation = () =>{
    // get email from database and check that it is correct or something
    if(emailText != ""){
      setHappensNextAccess("The information will be sent within the next 24 hours")
    }
    else{
      setHappensNextAccess("email not valid")

    }
  }

  const SubmitRemoveAccount = () => {
    let checkAgainst = "Remove account"
    if(removeAccountQuestion ==checkAgainst){
      setHappensNextText("Your account will be removed in the next 24 hours")
      
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
                  <Button onClick={btnLogIn} size ='15px' color="primary" variant="contained" startIcon={<AccountCircle />}>
                    Sign In
                  </Button>
                </ThemeProvider>
              </div>
              
              <div className='header'>
              <h1 >Mealplanner</h1>
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
                     Sumbit
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
                   Access information 
                  </p>
                 
                <form fullWidth onSubmit={handleSubmit}>
                  <div className='submitForm'>
                  <label  className='textForm'>
                    Enter your email: 
                  </label>

                  
                    <input  onChange={handleChangeEmailText} type='text'></input>
                    <ThemeProvider theme={theme}>
                    <Button onClick={sumbitAccessInformation} size ='15px' color="primary" variant="contained" startIcon={<CheckIcon />}>
                     Sumbit
                    </Button>
                    </ThemeProvider>
                    </div>
                </form>
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