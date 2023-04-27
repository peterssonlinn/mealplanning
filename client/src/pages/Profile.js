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
import axios from 'axios'
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
import {auth, db, logout} from "../firebase";
import {query, collection, getDocs, where} from "firebase/firestore"

function Profile() {
    const [searchFor, setSearchFor] = useState('');
    const[showLogin, setShowLogin] = useState(false);
    const[userLogin , setUserInputs] = useState({});
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [headerInfoSearch, setHeaderInfoSearch] = useState('');
    const [showUpdateText, setUpdateTextView] = useState(false);
    const [showChangeAvatar, setChangeAvatar] = useState(false);
    const [textAboutMe, setAboutMe] = useState();
    const [newTextAboutMe, setTextAboutMe] = useState('');
    const [avatar, setAvatar] = useState('');
    const [carouselData, setCarouselData] = useState([]);
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();


    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      }catch(err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };
    useEffect(() => {
      if (loading) return;
      if (!user) return navigate ("/");
      fetchUserName();
    }, [user, loading]);

    let [orginalData, setOrginalData] = useState([]);


    const handleDragStart = (e) => e.preventDefault();

    const[loadingDefault, setLoadingDefault] = useState(true);
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

    
   
    useEffect(() => {
      setAboutMe("I really like carrots");
      setAvatar(avatarImage3);
      setLoadingDefault(false);
    }, []);

    useEffect(() => {
      axios.get("/api/recipes/?search="+"egg")
        .then(response => {
          setCarouselData(response.data) ;
          setOrginalData(response.data);
        })
        .catch(error => console.error(error));

    }, []);

    

    const newTextButton = () => {
      if(newTextAboutMe) {
        setAboutMe(newTextAboutMe);
        setTextAboutMe("");
        setUpdateTextView(!showUpdateText);
        
      }

    }
    
    const btnChooseAvatar = (event) => {
      
      if(event.target.src){

        let orgString = event.target.src;
        let checkAgainst = orgString.split("http://localhost:3000").pop();
        if(checkAgainst === avatarImage1){
          setAvatar(avatarImage1);
        }
        else if(checkAgainst === avatarImage2){
          setAvatar(avatarImage2);
        }
        else if(checkAgainst === avatarImage3){
          setAvatar(avatarImage3);
        }
        else if(checkAgainst === avatarImage4){
          setAvatar(avatarImage4);
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
        let newData = []
       
        for(let element in carouselData){
          
          
          let name = carouselData[element]; 
          name = name[1];
          
          name = name.toLowerCase();
          
          if(name.includes(search) ){
            newData.push( carouselData[element])
          
          }

        }
        console.log(newData)
        setCarouselData(newData)

  
      } 
      else{
        setSearchFor('')
        console.log(orginalData)
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
        <h1 >Mealplanner</h1>
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
              About me {name}
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
  
  </div>
  );
}

export default Profile;


