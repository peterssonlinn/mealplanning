import { Link} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'
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
import {onSnapshot,collection} from "firebase/firestore"
import "./Home.css"



function Home() {

  const [searchFor, setSearchFor] = useState('');
  const [items, setItems] = useState([]);
  const [errorText, setErrorText] = useState('');
  const [headerInfoSearch, setHeaderInfoSearch] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [likedItems, setLikedItems] = useState([]);
  const isItemLiked = (url) => likedItems.includes(url);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate ("/");
    setLoggedIn(true);
    fetchLikedRecipes();

    /**
     * Sets up a listener for changes to the user's recipe collection in Firestore.
     * When a change is detected, the fetchLikedRecipes function is called to update the UI.
     */
    const refCollection = collection(db,"users", user.uid,"Recipe");
    const update = onSnapshot(refCollection, (snapshot) => {
      fetchLikedRecipes();
    });
  }, [user, loading]);

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
    }

  };


  const changeLogOut = async () => {
    try {
      logout();
      setLoggedIn(false); // set loggedIn to false when user logs out
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Handles the click event of the "like" button for a recipe. If the recipe is already
   * liked, it will be removed from the user's liked recipes. If it is not already liked,
   * it will be added to the user's liked recipes.
   * @param {string} name - the name of the recipe
   * @param {string} url - the URL of the recipe
   * @param {string} img - the URL of the recipe's image
   * @returns None
   */
  const handleLikedButton = (name, url, img) => {
    
    if (likedItems.includes(name)) {
      
      let remove = removeRecpie(user.uid, name, url, img).then((response) =>{
        
        setLikedItems((prevLikedItems) => prevLikedItems.filter((item) => item !== name));        
      });
      
    } else {
      let add = addRecpie(user.uid, name, url, img).then((response) =>{
        setLikedItems((prevLikedItems) => [...prevLikedItems, name]);
       
      })
      
    }
  };

  const btnAutoFill = (event) =>{
    setSearchFor(searchFor + " " + event.target.textContent)
    
  }
  
  /**
   * Handles the click event for the search button. Sends a GET request to the server
   * to retrieve recipes that match the search query. If successful, updates the state
   * with the search results and clears any error messages. If unsuccessful, logs the
   * error and displays an error message to the user.
   * @returns None
   */
  const handleClickSearch = () => {
    if(searchFor != ""){
      setItems([]);
      setHeaderInfoSearch('');
      axios.get("/api/recipes/?search="+searchFor)
      .then((res) =>  {
        if (res.status === 200){
          setErrorText("");
          setHeaderInfoSearch('result for: '+searchFor);
          setItems(res.data);   
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
