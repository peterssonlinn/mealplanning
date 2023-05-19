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
import {auth, db, logout, updateTextAboutUser, updateAvatarUser, fetchRecipeList,removeRecpie, addRecpie} from "../firebase";
import {query, collection, getDocs, where} from "firebase/firestore"
import "./Profile.css";



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
    const handleDragStart = (e) => e.preventDefault();

    const[loadingDefault, setLoadingDefault] = useState(true);
    const isItemLiked = (name) => likedItems.includes(name);
    const [likedItems, setLikedItems] = useState([]);
    let [orginalData, setOrginalData] = useState([]);



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
   
    const fetchInfo = async () =>{
      const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
    
      setAboutMe(data.aboutText);
      setAvatar(data.myAvatar);
      setLoadingDefault(!loadingDefault);
      

    };

    // const refreshImage =  (image) =>{
    //   var res = axios.get(image)
    //     .then(() => {
    //       return true
    //     })
        
    //     .catch(error =>{
    //       // console.log('inne i catch', error);
    //       return false

    //     });

    //     return res

    // }

    // const updateImage =  (recipe,link) =>{
    //   var worked = axios.get("/api/recipes/?search="+recipe) 
    //   .then((res) =>  {
    //     console.log('res.data',res.data);
    //     (res.data).forEach(async (rec) =>{
    //       if(rec[3] === link){
    //         let newLink = rec[5];
    //         let update = await updateOldImage(user.uid, rec[1], newLink).then((response) =>{
    //           console.log('update in database');
    //         })
    //       }
    //     });
    //   })
    //   .catch((error) => {
    //     console.log('error i updateImage', error,recipe);
        
    //   })

    // };

    const fetchLikedRecipes =  () =>{
      try{
        let prevLiked = []
        let info = []

        let recipeList = fetchRecipeList(user.uid).then((response) =>{
          response.forEach(async (recipe) =>{
            // console.log(recipe.img)
            // const shouldRefresh = await refreshImage(recipe.img);
            // console.log('shouldRefresh', shouldRefresh)
            // if (!shouldRefresh){
            //   console.log("inside shouldRefresh");
            //   console.log(recipe.url)
            //   await updateImage(recipe.name,recipe.url);
            //   await sleep(5000)
            // }
            info.push(recipe);
            if(recipe.name){
              // console.log('inne i ', recipe.name)
              prevLiked.push(recipe.name)
             // info.push(recipe.name)
              
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
        alert("An error occured while fetching liked recipes data");
      }
  
    };

    // useEffect(() => {
    //   console.log('likedItems updated:', likedItems);
    // }, [likedItems]);

    useEffect(() => {
      if (loading) return;
      if (!user) return navigate ("/");
      fetchUserName();
      fetchInfo();
      fetchLikedRecipes();
    }, [user, loading]);



    

    const handleLikedButton = (name,url, img) => {
      if (likedItems.includes(name)) {
        // console.log("inne i if, likeditems is included in list")
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
          alert("An error occured while setting user data");
    
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
        alert("An error occured while setting user data");
  
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


