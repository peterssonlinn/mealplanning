import React, {useEffect, useRef, useState} from 'react';
import avatarImage1 from '../images/icons/1.jpeg';
import avatarImage2 from '../images/icons/2.jpeg';
import avatarImage3 from '../images/icons/3.jpeg';
import avatarImage4 from '../images/icons/4.jpeg';
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
import { useNavigate} from 'react-router-dom';
import {auth, db, logout, fetchFriendList, addFriendToList, removeFriendFromList, getInfoOtherUser,fetchFriendsRecipe, fetchRecipeList, removeRecpie, addRecpie} from "../firebase";
import {query, collection, getDocs, where} from "firebase/firestore"
import "./Friends.css"

function Friends() {
    const [searchFor, setSearchFor] = useState('');
    const[showLogin, setShowLogin] = useState(false);
    const[userLogin , setUserInputs] = useState({});
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [ourLikedItem, setOurLiked] = useState([]);
   
    const [textAboutUser, setAboutUser] = useState();
    const [avatar, setAvatar] = useState('');
    const [carouselData, setCarouselData] = useState([]);
    const [showValidUser, setShowValidUser] = useState(false);
    const[loadingDefault, setLoadingDefault] = useState(true);
    const [likedItems, setLikedItems] = useState([]);
    const [friendsToUser, setFriendsToUser] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState('');
    const refToAutoComplete = useRef(null);
    

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [friendName, setFriendName] = useState("");
  const isItemLiked = (name) => likedItems.includes(name);


  const navigate = useNavigate();


  const fetchUserName = async () => {
    try {
      setLoggedIn(true);
      const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
      
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
     // alert(data.uid);
      //setName(data.name);
    }catch(err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchFriendsToUser = async () =>{

    if(!loggedIn && !user){
      return
    }

    try{
      
      console.log('user id', user.uid);
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

  const removeFriendInCollection = async (friend) =>{
    try{
      let friendList = removeFriendFromList(user.uid,selectedFriend).then((response) => {
        fetchFriendsToUser();
      })
    }catch (err){
      console.error(err);
      alert("An error occured while fetching user data");
    }

  };

  const addFriendInCollection = async () =>{
    try{
      let friendList = addFriendToList(user.uid,selectedFriend).then((response) => {
        fetchFriendsToUser();
      })
    }catch (err){
      console.error(err);
      alert("An error occured while fetching user data");

    }
  };
  const fetchRecipeListOwn = () =>{

    try{
      let temp = []
      let recipeList = fetchRecipeList(user.uid).then((response) =>{
          
        response.forEach(async (recipe) =>{
            temp.push(recipe.name);
          });
      
      });
     
      setOurLiked(temp)
      console.log(ourLikedItem)
    }
    catch (err){
      console.error(err);
      console.log(user.uid)
      console.log("An error occured while fetching user's own recipe");

    }
  };

  useEffect(() => {
    if (!user) return navigate ("/");
    if(user) {
      setIsLoading(false);
      fetchUserName();
      fetchFriendsToUser();
      fetchRecipeListOwn();
    }
  }, [user]);

    let [orginalData, setOrginalData] = useState([]);



    const handleDragStart = (e) => e.preventDefault();

  

    const handleChangeOption = (event, value) =>{
      setSelectedFriend(value);
     
      
    };

   
    const btnRemoveFriend = () =>{
      if( selectedFriend && friendsToUser.includes(selectedFriend)){
        let index = friendsToUser.indexOf(selectedFriend);
        if (index > -1) {
          friendsToUser.splice(index, 1);
          removeFriendInCollection(selectedFriend);
          setFriendsToUser(friendsToUser);
        }
      }

     

    }
    const btnAddFriend = () =>{
      if(selectedFriend && !friendsToUser.includes(selectedFriend)){
        addFriendInCollection();
      }
    };


    const handleLikedButton = (name,url, img) => {
      if (likedItems.includes(name)) {
       
        console.log(name)
        let remove = removeRecpie(user.uid, name, url, img).then((response) =>{
         
          setLikedItems((prevLikedItems) => prevLikedItems.filter((item) => item != name));
          
        });
        
       
      } else {
        // console.log("inne i else, likeditems is NOT! included in list")
        let add = addRecpie(user.uid, name, url, img).then((response) =>{
          setLikedItems((prevLikedItems) => [...prevLikedItems, name]);
         
        })
        
      }
     
    };

    const getFriendsRecipe =  (email) =>{
      try{
        let ourLiked = []
        let info = []
       
        let recipeList = fetchFriendsRecipe(user.uid,email).then((response) =>{
          
          response.forEach(async (recipe) =>{

            console.log(recipe)
            
            info.push(recipe);
            console.log(ourLikedItem)

            if(ourLikedItem.includes(recipe.name)){
              console.log('inne i if')
             
              ourLiked.push(recipe.name)
            }
          });
        
          if(info != 0){
            setCarouselData(info) ;
            setLikedItems(ourLiked);
            setOrginalData(info);
          }
        });
      }
      catch(err) {
        console.error(err);
        alert("An error occured while fetching liked recipes data");
      }
  
    };


    
    
    const btnSearchUser = (event) => {
      if (selectedFriend){
        try{
          setFriendName('');
          setAboutUser('');
          getFriendsRecipe('');
          setCarouselData([]);
          fetchRecipeListOwn();

          let friendInfo = getInfoOtherUser(user.uid,selectedFriend).then((response) => {
         
            setShowValidUser(!showValidUser);
            setFriendName(response[0]);
            setAboutUser(response[1]);
            setAvatar(response[2]);
            getFriendsRecipe(selectedFriend);
            
            setLoadingDefault(false);


          })
        }catch (err){
          console.error(err);
          alert("An error occured while fetching user data");
    
        }
       
      }
      else{
        //no valid user show msg!
        if(showValidUser){
          setShowValidUser(!showValidUser)
        }
       
        
      }
    }; 

    

    const btnAutoFill = (event) =>{
      setSearchFor(searchFor + " " + event.target.textContent);
      
    }

   
      
    const handleClickSearch = () => {
      let search = searchFor.toLowerCase();
      
      if(searchFor != ""){
        let newData = []
       
        for(let element in carouselData){
          
          
          let name = carouselData[element]; 
          name = name[1];
          
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

        {showValidUser &&
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
                {!loadingDefault && textAboutUser}
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
                  <img className='imgRecipeCarousel' src={item[5]}/> 
                 
               </div>
              ))}
          </AliceCarousel>
          </div>
        </div>
        </div>

        }


    </div>
  </div>
  );
}

export default Friends;