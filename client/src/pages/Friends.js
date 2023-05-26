import React, {useEffect, useRef, useState} from 'react';

import avatarImage1 from '../images/icons/1.jpeg';
import avatarImage2 from '../images/icons/2.jpeg';
import avatarImage3 from '../images/icons/3.jpeg';
import avatarImage4 from '../images/icons/4.jpeg';
import { Link, useNavigate } from 'react-router-dom';

import '../../src/App.css';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
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
import Avatar from '@mui/material/Avatar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ForwardIcon from '@mui/icons-material/Forward';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, db, logout, fetchFriendList, addFriendToList, removeFriendFromList, getInfoOtherUser,fetchFriendsRecipe, fetchRecipeList, removeRecpie, addRecpie} from "../firebase";
import {query, collection, getDocs, where, onSnapshot} from "firebase/firestore"
import "./Friends.css"

function Friends() {
 
  const [searchFor, setSearchFor] = useState('');
  const [usersLikedRecipe, setUsersLikedRecipe] = useState([]);
  const [textAboutUser, setAboutUser] = useState();
  const [avatar, setAvatar] = useState('');
  const [carouselData, setCarouselData] = useState([]);
  const [showValidUser, setShowValidUser] = useState(false);
  const [friendsToUser, setFriendsToUser] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const handleDragStart = (e) => e.preventDefault();
  const [selectedFriend, setSelectedFriend] = useState('');
  let [orginalData, setOrginalData] = useState([]);
  const refToAutoComplete = useRef(null);
  const [user, loading, error] = useAuthState(auth);

  const isItemLiked = (name) => usersLikedRecipe.includes(name);


  const navigate = useNavigate();


  const fetchUserName = async () => {
    try {
      setLoggedIn(true);
      const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
      
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
    
    }catch(err) {
      console.error(err);
      console.log("An error occured while fetching user data");
    }
  };

  const fetchFriendsToUser =  () =>{
    try{
      let result = [];

      let friendList = fetchFriendList(user.uid).then((response) => {
        response.forEach((friend)=>{
          if(friend.email){
            result.push(friend.email)
          }
        })
        if(result.length != 0){
          setFriendsToUser(result)
        }

      })
    }catch (err){
      console.error(err);
      alert("An error occured while fetching user data");

    }
  };

  const removeFriendInCollection = (friend) =>{
    try{
      let friendList = removeFriendFromList(user.uid,friend).then((response) => {
        fetchFriendsToUser();
      })
    }catch (err){
      console.error(err);
      alert("An error occured while fetching user data");
    }

  };

  const addFriendInCollection = (friend) =>{
    try{
      let friendList = addFriendToList(user.uid,friend).then((response) => {
        fetchFriendsToUser();
      })
    }catch (err){
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  
  const fetchRecipeListOwn = async () =>{

    try{
      let temp = []
      let recipeList = await fetchRecipeList(user.uid)
      recipeList.forEach((recipe) =>{
        temp.push(recipe.name);
      });
      
      setUsersLikedRecipe(temp);
    }
    catch (err){
      console.error(err);
      
      console.log("An error occured while fetching user's own recipe");

    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate ("/");
    if(user) {
      fetchUserName();
      fetchFriendsToUser();
      fetchRecipeListOwn();
      
      const refCollectionLiked = collection(db,"users", user?.uid,"Recipe");
      const updateLiked = onSnapshot(refCollectionLiked, (snapshot) => {
        
        console.log("innne i updateLiked onSnapshot" );
        console.log(selectedFriend)
        
        fetchRecipeListOwn().then(() => {
          console.log("innan getFriends",selectedFriend )
          getFriendsRecipe(selectedFriend)
        });

       
    });

      const refCollectionFriends = collection(db,"users", user?.uid,"Friends");
      const updateFriends = onSnapshot(refCollectionFriends, (snapshot) => {
        fetchFriendsToUser();
        
      });
    }
  }, [user, loading]);


    const handleLikedButton = (name,url, img) => {
      if (usersLikedRecipe.includes(name)) {
       
        let remove = removeRecpie(user.uid, name, url, img).then((response) =>{  
          fetchRecipeListOwn();
          
        });
        
       
      } else {
        let add = addRecpie(user.uid, name, url, img).then((response) =>{
          fetchRecipeListOwn();
         
        })
        
      }
     
    };

    

    const getFriendsRecipe = async (otherUser) =>{
      try{
        let ourLiked = []
        const info = []
        if(!otherUser){
          return
        }
    
        console.log('otherUser in getFriendsRecipe',otherUser)
        let recipeList = await fetchFriendsRecipe(user.uid,otherUser);
        
        recipeList.forEach( (recipe) =>{
            info.push(recipe);
          });
        
          if(info != 0){
            setCarouselData(info);
            setOrginalData(info);
          }
       
      }
      catch(err) {
        console.error(err);
        alert("An error occured while fetching liked recipes data");
      }
  
    };


    const getInfoAboutSelected = (otherUser) =>{
      let friendInfo = getInfoOtherUser(user.uid, otherUser).then((response) =>{
        setFriendName(response[0]);
        setAboutUser(response[1]);
        setAvatar(response[2]);
        return response
      });

      return friendInfo;

    }
    
    const btnSearchUser = (event) => {
      
      if(!selectedFriend){
        return
      }

      if(selectedFriend === user.email){
        return  navigate('/profile');
      }
      try {
        getInfoAboutSelected(selectedFriend).then(() => {
          getFriendsRecipe(selectedFriend);
        });
        


        
      } catch (error) {
        console.log('error in btnSearchUser', error)
      }

      console.log(selectedFriend);

     
      
    }; 

    

    const handleClickSearch = () => {
      let search = searchFor.toLowerCase();
      
      if(searchFor != ""){
        let newData = [];
        for(let element in carouselData){
          let name = carouselData[element]['name'];   
          name = name.toLowerCase();
          
          if(name.includes(search) ){
            newData.push( carouselData[element]);
          }

        }
        setCarouselData(newData);
      } 
      else{
        setSearchFor('');
        setCarouselData(orginalData);
      }
    };


    const btnRemoveFriend = () =>{
      if( selectedFriend && friendsToUser.includes(selectedFriend)){
          removeFriendInCollection(selectedFriend);
      }
    }

    const btnAddFriend = () =>{
      if(selectedFriend && !friendsToUser.includes(selectedFriend)){
        addFriendInCollection();
      }
    };

    const handleChangeOption = (event, value) =>{
      console.log('event',event);
      console.log('value',value)
      setSelectedFriend(value);
    };
      
    const btnAutoFill = (event) =>{
      setSearchFor(searchFor + " " + event.target.textContent);
      
    }
    const handleInputChange = (event) => {
      setSearchFor(event.target.value);
    };
    const handleSubmit = (e) =>{
      e.preventDefault();
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

        <div className='overlaySearchUser'>
          <form  onSubmit={handleSubmit}>
            <div className='submitFormFriends'>
              <label className='textFormFriends' > Search user:  </label>
              <ThemeProvider theme={theme}>
              <Autocomplete
                onChange={handleChangeOption}
                color='primary'
                 sx={{ width: 700 }}
                  freeSolo
                 
                  options={friendsToUser.map((option) => option)}
                  renderInput={(params) => (
                    <TextField
                    
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        style: {
                          color: 'white',
                          font: 'inherit'
                         
                        }
                      }}
                    />
                  )}
                  ref={refToAutoComplete}
                />

             
              <Button onClick={btnAddFriend} size ='15px' color="primary" variant="contained" startIcon={<PersonAddIcon />}>
               Add friend
              </Button>
              <Button onClick={btnRemoveFriend} size ='15px' color="primary" variant="contained" startIcon={<PersonRemoveIcon />}>
              Remove friend
              </Button>
              <Button onClick={btnSearchUser} size ='15px' color="primary" variant="contained" startIcon={<SearchIcon />}>
                Search on friend
              </Button>

              </ThemeProvider>
              </div>
          </form>
        </div>

        
        <div>
           
        <div className='searchAboutField'>
       
          <div className='searchField'>
         
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

          </div>


          
          <div className='aboutMeField'>
            <div className='aboutMeHeader'>
                <h5 className='headerAboutMe'>
                About {friendName}
                </h5>
                <p className='textAboutMe' >
                {textAboutUser}
                </p>
            </div>  
            
            <div className='avatar'>
                <Avatar sx={{width: 80, height: 80}} alt="Profil picture" src={avatar} />
            </div>

          </div>  

        </div> 
        
        <div className='overlayHomePage'>
          <div className='carousel'>
          <AliceCarousel touchMoveDefaultEvents={true} 
          mouseTracking
          infinite={true}
          renderNextButton={() => {
            return   <Button   startIcon={<ForwardIcon  sx={{ color: '#E4EDDB' }} />}> </Button>
          }}
          
          renderPrevButton={() => {
            return  <Button  startIcon={<ForwardIcon  sx={{ transform:"rotate(180deg)", color: '#E4EDDB' }} />}> </Button>
          }}

          >
            {carouselData.map((item, index) => (
              <div className="theInfoCarousel"> 
              <a target='_blank' href={item['url']}  className="listOfItemsCarousel" key={index}>
              <h5 className="headingInfoCarousel">{item['name']}</h5>
              </a>
             
                  <small className='small'>{item[6]}</small>
                  
                  <ThemeProvider theme={theme}>
                    <Button onClick={(event) => { 
                    event.preventDefault() 
                    handleLikedButton(item['name'], item['url'], item['img'])
                      }} size='15px' color="primary"  startIcon={isItemLiked(item['name']) ?  <FavoriteIcon /> : <FavoriteBorderIcon />}>
                    </Button>
                  </ThemeProvider>
                  <img className='imgRecipeCarousel' src={item['img']}/> 
                 
               </div>
              ))}
          </AliceCarousel>
          </div>
       
        </div>
        
        </div>
        
      
        

       
    </div>
  </div>
  );
}

export default Friends;