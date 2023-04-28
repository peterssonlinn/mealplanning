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
import {auth, db, logout, fetchFriendList} from "../firebase";
import {query, collection, getDocs, where} from "firebase/firestore"

function Friends() {
    const [searchFor, setSearchFor] = useState('');
    const[showLogin, setShowLogin] = useState(false);
    const[userLogin , setUserInputs] = useState({});
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = useState([]);
    const [errorText, setErrorText] = useState('');
   
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
  const [name, setName] = useState("");
  const navigate = useNavigate();


  const fetchUserName = async () => {
    try {
      setLoggedIn(true);
      const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
      
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
     // alert(data.uid);
      setName(data.name);
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
      setLoggedIn(true);
      console.log('user id', user.uid);

      let temop = fetchFriendList(user.uid,"hej");
      console.log('temp', temop);
      
    }catch (err){
      console.error(err);
      alert("An error occured while fetching user data");

    }


    //query efter alla friends to a user, 
   // const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
    // const doc = await getDocs(q);
    // const data = doc.docs[0].data();
    // check if collection exists 
    //setFriendsToUser(data.friends);


  };

  const removeFriendInCollection = async (friend) =>{
    // check that that friend actually exists before removal!  
    // email uniq!

  };

  const addFriendInCollection = async (friend) =>{
    // check that the friend exists
    

  };
  useEffect(() => {
    if (!user) return navigate ("/");
    if(user) {
      setIsLoading(false);
      fetchUserName();
      fetchFriendsToUser();
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
          // remove from collection in database!
          removeFriendInCollection(selectedFriend);
         
          setFriendsToUser(friendsToUser);
        }
      }

     

    }
    const btnAddFriend = () =>{
      if(selectedFriend && !friendsToUser.includes(selectedFriend)){
        // add to collection in database and 
        addFriendInCollection(selectedFriend);

        friendsToUser.push(selectedFriend)
        setFriendsToUser(friendsToUser);

      }
      
      
     
    };

    const isItemLiked = (url) => likedItems.includes(url);

    const handleLikedButton = (url) => {
      window.alert(url)
  
      if (likedItems.includes(url)) {
        setLikedItems((prevLikedItems) => prevLikedItems.filter((item) => item !== url));
       
      } else {
        setLikedItems((prevLikedItems) => [...prevLikedItems, url]);
      }
    };

    
    
    const btnSearchUser = (event) => {
      
      console.log(selectedFriend);

      //check the the searched user is valid and then set all information!
      if (selectedFriend){
        setShowValidUser(!showValidUser);
        setAboutUser("I really like carrots");
        setAvatar(avatarImage2);
        setLoadingDefault(false);

        axios.get("/api/recipes/?search="+"fish")
        .then(response => {
          setCarouselData(response.data) ;
          setOrginalData(response.data);
        })
        .catch(error => console.error(error));
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
                About 
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
              <a target='_blank' href={item[3]}  className="listOfItemsCarousel" key={index}>
              <h5 className="headingInfoCarousel">{item[1]}</h5>
              </a>
             
                  <small className='small'>{item[6]}</small>
                  
                  <ThemeProvider theme={theme}>
                    <Button onClick={(event) => { 
                    event.preventDefault() 
                    handleLikedButton(item[3])
                      }} size='15px' color="primary"  startIcon={isItemLiked(item[3]) ? <FavoriteBorderIcon />  : <FavoriteIcon />}>
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