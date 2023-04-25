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
import LoginButton from './LoginButton';
import SignupButton from './SignupButton';
import LogoutButton from './LogoutButton';
import AuthButton from './AuthButton';
import AuthNav from './AuthNav';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import EggIcon from '@mui/icons-material/Egg';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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



  const isItemLiked = (url) => likedItems.includes(url);

  const [likedItems, setLikedItems] = useState([]);

  const handleLikedButton = (url) => {
    window.alert(url)

    if (likedItems.includes(url)) {
      setLikedItems((prevLikedItems) => prevLikedItems.filter((item) => item !== url));
     
    } else {
      setLikedItems((prevLikedItems) => [...prevLikedItems, url]);
    }
  };



  const btnLogIn = () =>{
    setShowLogin((showLogin) => !showLogin);
  }
  
 

  const btnAutoFill = (event) =>{
    setSearchFor(searchFor + " " + event.target.textContent)
    
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
        setSearchFor("");
      })
      
  
      
    } 
  };
  

  const handleInputChange = (event) => {
    setSearchFor(event.target.value);
  };

  const selectRef = React.useRef();

  

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
        <h1 >MealMate</h1>
        </div>
       

      
        <div className='navbar'>
          {/* Render the NAvBar component */}
          <NavBar />
        </div>
        </div>

        <div className='overlayHomePage'>
          <div className='searchTextMain'>
          
          <div className='searchInput'>
          <input className='searchInput' type="text" value={searchFor} onChange={handleInputChange} />
          </div>


          <div className='buttonSearch'>
          <ThemeProvider theme={theme}>
          
          <Button onClick={handleClickSearch} size='15px' color="primary" variant="contained" startIcon={<SearchIcon />} />
          </ThemeProvider>
          </div>
          </div>

          <div className='autoFillWithContent'>
          <ThemeProvider theme={theme}>
            

            <Button onClick={btnAutoFill} size ='15px' color="primary" variant="contained" startIcon={<RamenDiningIcon />}>
              Ramen
            </Button>

            <Button onClick={btnAutoFill} size ='15px' color="primary" variant="contained" startIcon={<LunchDiningIcon />}>
              Burger
            </Button>
            <Button onClick={btnAutoFill} size ='15px' color="primary" variant="contained" startIcon={<BakeryDiningIcon />}>
              Croissant
            </Button>

            <Button onClick={btnAutoFill} size ='15px' color="primary" variant="contained" startIcon={<EggIcon />}>
              Egg
            </Button>
            <Button onClick={btnAutoFill} size ='15px' color="primary" variant="contained" startIcon={<LocalPizzaIcon />}>
              Pizza
            </Button>

          </ThemeProvider>
          </div>   

          <div className='allInfo'>
            <div className="list-group">
             
              
              {items.map((item, index) => (
                 <div className="theInfoCarousel"> 
                <a href={item[3]}  className="listOfItems" key={index}>
                <h5 className="headingInfo">{item[1]}</h5>
                </a>
               
                    <small className='small'>{item[6]}</small>
                    
                    <ThemeProvider theme={theme}>
                      
                      <Button onClick={(event) => { 
                      event.preventDefault() 
                      handleLikedButton(item[3])
                        }} size='15px' color="primary"  startIcon={isItemLiked(item[3]) ? <FavoriteIcon /> : <FavoriteBorderIcon />}>
                      </Button>
                    </ThemeProvider>
                    <img className='imgRecipe' src={item[5]}/> 
                   
                 </div>
                ))}
            </div>
            <div className='fillEmptySearch'>
              <p>
                {errorText}
              </p>
            </div>

          </div>
        </div>

    </div>
    </div>
  );
}

export default Home;
