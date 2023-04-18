import { Link, Route, withRouter} from 'react-router-dom';
import React, {useState} from 'react';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import DehazeIcon from '@mui/icons-material/Dehaze';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import axios from 'axios'
import { Switch } from '@mui/material';
import LoginButton from './LoginButton';
import SignupButton from './SignupButton';
import LogoutButton from './LogoutButton';
import AuthButton from './AuthButton';
import AuthNav from './AuthNav';
import NavBar from './NavBar';

import FavoriteIcon from '@mui/icons-material/Favorite';



function Home() {

  const [searchFor, setSearchFor] = useState('');
  const[showLogin, setShowLogin] = useState(false);
  const[userLogin , setUserInputs] = useState({});
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = useState([]);
  const [errorText, setErrorText] = useState('');
  const [headerInfoSearch, setHeaderInfoSearch] = useState('');

  const isAuthenticated = false;


  const handleLogin = (event) =>{
    event.preventDefault();
    window.alert(`entered, ${userLogin.username}`);
    window.alert(`entered, ${userLogin.password}`);
   
  }

  const handleChangeLogin = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserInputs(values => ({...values, [name]:value}))
  }

  const btnLogIn = () =>{
    setShowLogin((showLogin) => !showLogin);
  }
  
  const handleLikedButton = (theClickenItem) =>{
    window.alert(theClickenItem);
    

  }
  
  const handleClickSearch = () => {
    if(searchFor != ""){
      setItems([]);
      setHeaderInfoSearch('');
      axios.get("/api/recipes/?search="+searchFor)
      .then((res) =>  {
        if (res.status === 200){
          setErrorText("");
          console.log(res.data);
          setHeaderInfoSearch('result for: '+searchFor);
          setItems(res.data);
          //setData(res.data)
          
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorText("this did not work :(");
      })
      
  
      setSearchFor("");
    } 
  };
  

  const handleInputChange = (event) => {
    setSearchFor(event.target.value);
  };

  const selectRef = React.useRef();

  const openSelect = () =>{
    if (selectRef.current) {

      selectRef.current.focus();
    }

  }

  const clickDropdown = () => {
    setOpen((prev) => !prev);
  };

  const clickDropdownAway = () => {
    setOpen(false);
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
      <div className='headerSignAvaliable'> 
        <div className='signUpClassName'>
          <ThemeProvider theme={theme}>
            <Button onClick={btnLogIn} size ='15px' color="primary" variant="contained" startIcon={<AccountCircle />}>
              Sign In
            </Button>
          </ThemeProvider>
         <div>
            <div  className={`${!showLogin ? "active" : ""} show`}>
              <div className='divLoginRegister'>
                <form onSubmit={handleLogin}>
                  <h1> Sign in</h1>
                  <label> Username</label> <br />
                  <input type="text" name='username' className='loginBox' value={userLogin.username || ""} onChange={handleChangeLogin}/> <br />
                  <label> Password</label>  <br />
                  <input type='password' name='password' value={userLogin.password || ""} onChange={handleChangeLogin} className='loginBox'/>  <br />
                  <input type="submit" value="Log in" className='login-btn'/> 
                 
                </form>
                <Link to="/register">
                    <button  className='registerBtn'>Register</button>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
      <div>
      {/* Render the NAvBar component */}
      <NavBar />
    </div> 
      <h1 className='header'>Mealplanner</h1>
      
      <div className='info'>

     
      <div className='searchTextBtn'>
        <input className='search' type="text" value={searchFor} onChange={handleInputChange} />

        <ThemeProvider theme={theme}>
          <Button onClick={handleClickSearch} size='15px' color="primary" variant="contained" startIcon={<SearchIcon />} />
        </ThemeProvider>
       
       <div className="list-group">
        <h1 > {headerInfoSearch}</h1>
       
        {items.map((item, index) => (
          <a href={item[3]}  className="listOfItems" key={index}>
            <div className="theInfo"> 
            
              <h5 className="mb-1">{item[1]}</h5>
              <small>{item[5]}</small>
              
              <ThemeProvider theme={theme}>
                <Button onClick={(event) => { 
                event.preventDefault() 
                handleLikedButton(item[3])
                  }} size='15px' color="primary" startIcon={<FavoriteIcon />} >
                </Button>
              </ThemeProvider>
            </div>
  
          </a>
        ))}
    

        </div>
      <div className='fillEmptySearch'>
        <p>
          {errorText}
        </p>
      
    </div>
      </div>
      </div>


    <div>
      {/* Render the LoginButton component */}
      <LoginButton />
    </div>
    <div>
      {/* Render the SignupButton component */}
      <SignupButton/>
    </div>
  
    <div>
      {/* Render the LogoutButton component */}
      <LogoutButton />
    </div>

    <div>
      {/* Render the AuthenticationButton component with the isAuthenticated prop */}
      <AuthButton isAuthenticated={isAuthenticated} />
    </div>

    <div>
      {/* Render the AuthNav component with the isAuthenticated prop */}
      <AuthNav isAuthenticated={isAuthenticated} />
    </div>
      


    </div>
    </div>
  );
}

export default Home;