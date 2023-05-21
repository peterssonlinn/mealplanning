import React, {useRef, useEffect ,useState} from 'react';
import { Link } from 'react-router-dom';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import NavBar from './NavBar';
import timeGridPlugin from '@fullcalendar/timegrid';
//import interactionPlugin from '@fullcalendar/interaction';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate} from 'react-router-dom';
import {query, collection, getDocs, where} from "firebase/firestore"

import {auth, db, logout, fetchRecipeList, addRecipeCalender} from "../firebase";
import { v4 as uuidv4 } from "uuid";



function Calender() {

  
  const checkboxRef = useRef(null);
  const checkboxDelRef = useRef(null);
  const calendarRef = useRef(null);
  const savedRecepiesRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [links, setLinks] = useState([]);


  const handleRemoveEvent= () => {
    //window.alert("Clicked checkbox")
    if (checkboxDelRef.current.checked){
      //info.event.remove()
      window.alert("filled")
    }
    //info.jsEvent.preventDefault();
  };

  const handleClickedEvent = (clickedEvent) =>{
    const clicked = clickedEvent.event.title;
    const index = items.findIndex( i => i.name == clicked);
    if(index !== -1) {
      const url = items[index]['url']
      window.open(url)
  }
    
  

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
        setItems(info);
      });
      console.log("fetch from database fetchLiked");
      console.log(info)
    }
    catch(err) {
      console.error(err);
      console.log("An error occured while fetching liked recipes data");
    }

  };


  const fetchUserName = async () => {
    try {
      setLoggedIn(true);
      const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      console.log("fetch user name call")
      setName(data.name);
    }catch(err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

 
  const handleChangedEvent = (changedEvent) =>{
    console.log(changedEvent.event.start.toISOString())
    console.log(changedEvent.event.title)

  }

  

  useEffect( () => {
    if (!user) return navigate ("/");
    if(user) {
      setIsLoading(false);
      fetchUserName();
      fetchLikedRecipes();

     
      const checkbox = checkboxRef.current;
      
    
       const draggable = new Draggable(savedRecepiesRef.current, {
         itemSelector: '.fc-event',
         eventData: function(eventEl) {
          
          return {
            title : eventEl.innerText,
            infoEl : eventEl
          };
         }
       });
     
        return () => {
          draggable.destroy();
      //   //calendar.destroy();
       };
    }
   
  }, [user]);

  if (isLoading &&  !name  && !savedRecepiesRef) {
    return <div>Loading...</div>;
  }

  const changeLogOut = async () => {
    try {
      logout();
      setLoggedIn(false); // set loggedIn to false when user logs out
      navigate("/calender");
    } catch (err) {
      console.error(err);
      alert("An error occurred while logging out");
    }
  };
  const addRecipeToDatabase = (id, title, url, date, startStr, endStr, allDay) =>{
    try{
      let temp = addRecipeCalender(user.uid,id, title, url, date, startStr, endStr, allDay ).then((response) => {
        console.log('added to database');
      })
    }catch (err){
      console.error(err);
      alert("An error occured while adding user data");

    }
  };




  const handleNewEvent = async (newEvent) => {
    const title = await newEvent.draggedEl.innerText;
    const isAllDay =await  newEvent.allDay;
    let date;
    
    if(isAllDay){
      date = await newEvent.dateStr
    }
    else{
      date = await newEvent.dateStr;
      date =  await new Date(date);
      date = await (date.getFullYear() + '-' +  (date.getUTCMonth()+1) + '-' + date.getUTCDate());
    }
    
    const startDate = await newEvent.dateStr;
    const endDate = await newEvent.date;
    let url;
    const index = await items.findIndex( i => i.name == title);
    if(index !== -1) {
      url = await items[index]['url']
      console.log(url)
   }
   const id =await  uuidv4();
   console.log(id);

   console.log(typeof(id),typeof(title),typeof(isAllDay),typeof(date),typeof(startDate),typeof(endDate),typeof(url)       )
   addRecipeToDatabase(id, title, url, date, startDate, endDate, isAllDay);

   




  };

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
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


      <div className='list'>
        <div id='saved_recepies' ref={savedRecepiesRef} >
        {items.map((item, index) => ( 
          <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"  > 
              <div key={index}  className="fc-event-main">
                 {item['name']}
              </div>
            
          </div>
        ))}
             

          </div>

          <div id='calendar'>
        <FullCalendar 
          
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          firstDay={1}
          height={500}
          headerToolbar= {
             {left: 'prev,next today',
             center: 'title',
             right: 'dayGridMonth,timeGridWeek,timeGridDay'
           }}
          editable={true}
          droppable={true}
          weekends={true}
          eventBackgroundColor={'#307672'}
          eventTimeFormat={
              { hour: '2-digit',
              minute: '2-digit',
              hour12: false}}
          timeZone={'UTC+2'}
          locale={'en-SE'}
         
          
          drop={handleNewEvent}
          eventDrop={handleChangedEvent}
          eventClick={handleClickedEvent}

        />
          
      </div>
      
      <div className='removeEvent'>
      <p>
          <input type='checkbox' id='event-remove'  ref={checkboxDelRef} onChange={handleRemoveEvent}/>
          <label htmlFor='event-remove'>Remove from calendar?</label>
        </p>
      </div>
          
         
      </div>
      
        
      </div>
    </div>
  );
}
export default Calender;

