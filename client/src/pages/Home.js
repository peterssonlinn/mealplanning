import { Link, Route, withRouter} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
/*import { indigo } from '@mui/material/colors';
import DehazeIcon from '@mui/icons-material/Dehaze';

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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';*/
import axios from 'axios'
/*import LoginButton from './LoginButton';
import SignupButton from './SignupButton';
import LogoutButton from './LogoutButton';
import AuthButton from './AuthButton';
import AuthNav from './AuthNav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';*/
import NavBar from './NavBar';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import EggIcon from '@mui/icons-material/Egg';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate} from 'react-router-dom';
import {auth, db, logout, fetchRecipeList, addRecpie, removeRecpie} from "../firebase";
import {query, collection, getDocs, where} from "firebase/firestore"
import "./Home.css"



function Home() {

  const [searchFor, setSearchFor] = useState('');
  const[showLogin, setShowLogin] = useState(false);
  const[userLogin , setUserInputs] = useState({});
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = useState([]);
  const [errorText, setErrorText] = useState('');
  const [headerInfoSearch, setHeaderInfoSearch] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [likedItems, setLikedItems] = useState([]);
  const isItemLiked = (url) => likedItems.includes(url);




  const fetchUserName = async () => {
    try {
      setLoggedIn(true);
      const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    }catch(err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchLikedRecipes = async () =>{
    try{
      let prevLiked = []
      let recpieList = fetchRecipeList(user.uid).then((response) =>{
        response.forEach((recipe) =>{
          if(recipe.name){
            prevLiked.push(recipe.name)
          }
        })
        
        if(prevLiked != 0){
          setLikedItems(prevLiked);
        }

      });
    }
    catch(err) {
      console.error(err);
      alert("An error occured while fetching liked recipes data");
    }

  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate ("/");
    fetchUserName();
    fetchLikedRecipes();
  }, [user, loading]);

  const changeLogOut = async () => {
    try {
      logout();
      setLoggedIn(false); // set loggedIn to false when user logs out
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("An error occurred while logging out");
    }
  };



  const handleLikedButton = (name, url, img) => {
    
    if (likedItems.includes(name)) {
      
      let remove = removeRecpie(user.uid, name, url, img).then((response) =>{
        
        setLikedItems((prevLikedItems) => prevLikedItems.filter((item) => item !== name));
        console.log(likedItems)
        
      });
      
     
    } else {
     
      let add = addRecpie(user.uid, name, url, img).then((response) =>{
        setLikedItems((prevLikedItems) => [...prevLikedItems, name]);
       
      })
      
    }
  };



 /* const btnLogIn = () =>{
    setShowLogin((showLogin) => !showLogin);
  }
  */
 

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
        <div>
      {loggedIn ? (
        <Button onClick={changeLogOut} size ='15px' color="primary" variant="contained" startIcon={<AccountCircle />} >
        Log Out
      </Button>
      ) : (
      <Button component={Link} to="/login" size ='15px' color="primary" variant="contained" startIcon={<AccountCircle />} >
      Sign In
    </Button>
      )}
    </div>
            
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
                <a  target='_blank' href={item[3]}  className="listOfItems" key={index}>
                <h5 className="headingInfo">{item[1]}</h5>
                </a>
               
                    <small className='small'>{item[6]}</small>
                    
                    <ThemeProvider theme={theme}>
                      
                      <Button onClick={(event) => { 
                      event.preventDefault() 
                      handleLikedButton(item[1],item[3], item[5])
                        }} size='15px' color="primary"  startIcon={isItemLiked(item[1]) ? <FavoriteIcon /> : <FavoriteBorderIcon />}>
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
