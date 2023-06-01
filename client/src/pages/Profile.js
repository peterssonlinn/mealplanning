import React, {useEffect, useState} from 'react';
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
import NavBar from './NavBar';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import EggIcon from '@mui/icons-material/Egg';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Avatar from '@mui/material/Avatar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate} from 'react-router-dom';
import {auth, db, logout, updateTextAboutUser, updateAvatarUser, fetchRecipeList,removeRecpie, addRecpie, fetchInfoUserProfile} from "../firebase";
import {collection,onSnapshot, doc} from "firebase/firestore"
import "./Profile.css";



function Profile() {
    const [searchFor, setSearchFor] = useState('');
    const [showUpdateText, setUpdateTextView] = useState(false);
    const [showChangeAvatar, setChangeAvatar] = useState(false);
    const [textAboutMe, setAboutMe] = useState();
    const [newTextAboutMe, setTextAboutMe] = useState('');
    const [avatar, setAvatar] = useState('');
    const [carouselData, setCarouselData] = useState([]);
    const [user, loading, error] = useAuthState(auth);
    const [UserName, setUserName] = useState("");
    const navigate = useNavigate();
    const handleDragStart = (e) => e.preventDefault();
    const[loadingDefault, setLoadingDefault] = useState(true);
    const isItemLiked = (name) => likedItems.includes(name);
    const [likedItems, setLikedItems] = useState([]);
    let [orginalData, setOrginalData] = useState([]);

    useEffect(() => {
      if (loading) return;
      if (!user) return navigate ("/");
      fetchInfo();
      fetchLikedRecipes();

      /**
       * Creates a reference to the "Recipe" collection in the Firestore database for the current user and
       * sets up a listener for changes to the collection. When changes are detected, the function
       * fetchLikedRecipes() is called to update the list of liked recipes.
       */
      const refCollectionLiked = collection(db,"users", user.uid,"Recipe");
      const updateLiked = onSnapshot(refCollectionLiked, (snapshot) => {
        fetchLikedRecipes();
      });

      /**
       * Sets up a listener for changes to the user document in the Firestore database.
       * When changes are detected, the fetchInfo function is called to update the user's information.
       */
      const refCollectionUser = doc(db,"users", user?.uid);
      const updateUser = onSnapshot(refCollectionUser, (snapshot) => {
        fetchInfo();
      });

    }, [user, loading]);


    const fetchInfo = async () =>{
      let userInfo = fetchInfoUserProfile(user.uid).then((response) =>{
        setUserName(response.name);
        setAboutMe(response.aboutText);
        setAvatar(response.myAvatar);
      });
      setLoadingDefault(!loadingDefault);
    };

    const fetchLikedRecipes =  () =>{
      try{
        let prevLiked = []
        let info = []

        let recipeList = fetchRecipeList(user.uid).then((response) =>{
          response.forEach(async (recipe) =>{
        
            info.push(recipe);
            if(recipe.name){
              prevLiked.push(recipe.name);
            }
          });

          if(prevLiked != 0){
            setCarouselData(info) ;
            setLikedItems(prevLiked);
            setOrginalData(info);
          }
        });
      }
      catch(err) {
        console.error(err);
      }
  
    };

    

    const handleLikedButton = (name,url, img) => {
      if (likedItems.includes(name)) {
        let remove = removeRecpie(user.uid, name, url, img).then((response) =>{
          setLikedItems((prevLikedItems) => prevLikedItems.filter((item) => item != name));
          
        });
        
      } else {
        let add = addRecpie(user.uid, name, url, img).then((response) =>{
          setLikedItems((prevLikedItems) => [...prevLikedItems, name]);
         
        })
        
      }
     
    };

    const newTextButton = () => {
      if(newTextAboutMe) {
        try{
          let newText = updateTextAboutUser(user.uid,newTextAboutMe).then((response) => {
            setAboutMe(newTextAboutMe);
            setTextAboutMe("");
            setUpdateTextView(!showUpdateText);
          })
        }catch (err){
          console.error(err);    
        }
      }
    }

   
    const updateAvatarData = (avatar)=>{
      try{
        let newAvatar = updateAvatarUser(user.uid,avatar).then((response) => {
          setAvatar(avatar);
        })
      }catch (err){
        console.error(err);  
      }
    }
    
    const btnChooseAvatar = (event) => {
      
      if(event.target.src){

        let orgString = event.target.src;
        let checkAgainst = orgString.split("http://localhost:3000").pop();

        if(checkAgainst === avatarImage1){
          updateAvatarData(avatarImage1)
        }
        else if(checkAgainst === avatarImage2){
          updateAvatarData(avatarImage2)
        }
        else if(checkAgainst === avatarImage3){
          updateAvatarData(avatarImage3)
        }
        else if(checkAgainst === avatarImage4){
          updateAvatarData(avatarImage4)
        }
    }
      
    }

    const newAvatarPic = () => {
      setChangeAvatar(!showChangeAvatar);
    }

    const btnAutoFill = (event) =>{
      setSearchFor(searchFor + " " + event.target.textContent);
      
    }
      
    const handleClickSearch = () => {
      let search = searchFor.toLowerCase();
      if(searchFor != ""){
        
        let newData = [];
        for(let element in carouselData){ 
          let name = carouselData[element]['name']; 
          name = name.toLowerCase();
          if(name.includes(search) ){
            newData.push( carouselData[element])
          }
        }
        setCarouselData(newData)
      } 
      else{
        setSearchFor('')
        setCarouselData(orginalData);
      }
    };
      
    const handleUpdateText = () =>{
      setUpdateTextView(!showUpdateText);
    };

    const handleInputChange = (event) => {
      setSearchFor(event.target.value);
    };

    const theme = createTheme({
      palette: {
        primary: {
          main: '#307672',
        },
        secondary: {
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
              About me {UserName}
              </h5>
              <p className='textAboutMe' >
              {!loadingDefault && textAboutMe}
              </p>
            </div>  
            <div className='avatar'>
               <Avatar sx={{width: 80, height: 80}} alt="Profial picture" src={avatar} />
              </div>
          
          <div className='editText'>
          <ThemeProvider theme={theme}>
          <Button onClick={handleUpdateText} size='15px' color="primary" variant="contained" startIcon={<EditIcon />} >
            Edit text
          </Button>
          </ThemeProvider>
          </div>

         { showUpdateText &&  
          <div> 
              <input onChange = {(e) => setTextAboutMe(e.target.value)} value = {newTextAboutMe}></input>
              <ThemeProvider theme={theme}>
            <Button onClick={newTextButton} size='15px' color="primary" variant="contained" startIcon={<CheckIcon />} >
            </Button>
            </ThemeProvider>
            </div>
         }  
         {!showUpdateText && 
         <div>
         
         <p>
          </p>
          </div>
          }
         
          <div className='changeAvatar'>
             
              <ThemeProvider theme={theme}>
              <Button onClick={newAvatarPic} size='15px' color="primary" variant="contained" startIcon={<EditIcon />} >
                Change Avatar
              </Button>
              </ThemeProvider>
            

            </div>

            <div>
              {showChangeAvatar &&
            <ThemeProvider theme={theme}>
              <Button onClick={btnChooseAvatar} size ='15px' color="primary" variant="outlined" startIcon={<Avatar src={avatarImage1}/>} />
              <Button onClick={btnChooseAvatar} size ='15px' color="primary" variant="outlined" startIcon={<Avatar src={avatarImage2}/>}/>
              <Button onClick={btnChooseAvatar} size ='15px' color="primary" variant="outlined" startIcon={<Avatar src={avatarImage3}/>}/>
              <Button onClick={btnChooseAvatar} size ='15px' color="primary" variant="outlined" startIcon={<Avatar src={avatarImage4}/>}/>
            </ThemeProvider>
            }
            </div>
          </div>   
          
           

               
        </div>

        <div className='overlayHomePage'>
          <div className='carousel'>
          <AliceCarousel touchMoveDefaultEvents={true} 
          mouseTracking >
            {carouselData.map((item, index) => (
              
              <div className="theInfoCarousel"> 
              <a target='_blank' href={item['url']}  className="listOfItemsCarousel" key={index}>
              <h5 className="headingInfoCarousel">{item['name']}</h5>
              </a>
             
                  <small className='small'>{item[6]}</small>
                  
                  <ThemeProvider theme={theme}>
                    <Button onClick={(event) => { 
                    event.preventDefault() 
                    handleLikedButton(item['name'],item['url'], item['img'])
                      }} size='15px' color="primary"  startIcon={isItemLiked(item['name']) ? <FavoriteIcon /> : <FavoriteBorderIcon />}>
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
  );
}

export default Profile;


