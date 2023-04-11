import { Link } from 'react-router-dom';
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
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';


function Home() {

  const [searchFor, setSearchFor] = useState('');
  const[showLogin, setShowLogin] = useState(false);
  const[userLogin , setUserInputs] = useState({});
  const [open, setOpen] = React.useState(false);



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
  
  const[data, setData] = React.useState(null);
  
  const handleClickSearch = () => {
    if(searchFor != ""){
      axios
      .get("/api/recipes/?search="+searchFor)
      .then((res) => {
        if (res.status === 200){
          setData(res.data)
        }
      }

      ) 
      console.log(searchFor);
      
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
        main: indigo[500],
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
      

    },
  });

  /*const configureClient = async () => {
    auth0 = await createAuth0Client({
      domain: "dev-fs27qqhb2a2171p5.eu.auth0.com",
      client_id: "LbJM3Nckyt467aKYkezEesLkJoYLowqa",
      audience: "https://dev-fs27qqhb2a2171p5.eu.auth0.com/api/v2/" // The backend api id
    });
  }
const login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: "http://localhost:3000"
    });
  };
  const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
  };*/
  
  return (

    <div className='App'>
    <script src="https://cdn.auth0.com/js/auth0-spa-js/1.13/auth0-spa-js.production.js"></script>
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
      <div className = 'dehazeClass'>
          <ThemeProvider theme={theme}>
            <ClickAwayListener onClickAway={clickDropdownAway}>
            <Box sx={{ position: 'relative' }} className='boxDropdown'>
            <Button size='15px' color="primary" onClick={clickDropdown} variant="contained" startIcon={<DehazeIcon />} />
              {open ? (
                <Box className='boxDropdown'>
                  <FormControl fullWidth>
                  <MenuItem  component={Link} to="/">
                    <ListItemIcon>
                      <HomeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Home</ListItemText>
                    </MenuItem>

                  <MenuItem  component={Link} to="/profile">
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>

                  <MenuItem  component={Link} to="/calender">
                    <ListItemIcon>
                      <CalendarMonthIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Calender</ListItemText>
                  </MenuItem>

                  <MenuItem  component={Link} to="/friends">
                    <ListItemIcon>
                      <Diversity1Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Friends</ListItemText>
                  </MenuItem>

                  <MenuItem  component={Link} to="/settings">
                    <ListItemIcon>
                      <ManageAccountsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>

                  
                  </FormControl>
                </Box>
              ) : null}
            </Box>
          </ClickAwayListener>
        </ThemeProvider>
        </div>
      <h1 className='header'>Mealplanner</h1>
      
      <div className='searchTextBtn'>
        <input className='search' type="text" value={searchFor} onChange={handleInputChange} />

        <ThemeProvider theme={theme}>
          <Button onClick={handleClickSearch} size='15px' color="primary" variant="contained" startIcon={<SearchIcon />} />
        </ThemeProvider>
        
      </div>

      <p>{!data ? "LOADING...":data}</p>
      
     
       
    </div>
    </div>
  );
}

export default Home;
