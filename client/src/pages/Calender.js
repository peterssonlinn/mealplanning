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
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate} from 'react-router-dom';
import { collection,onSnapshot} from "firebase/firestore"
import {auth, db, logout, fetchRecipeList, addRecipeCalender,fetchCalender,updateEvent, removeEventCal} from "../firebase";
import { v4 as uuidv4 } from "uuid";



function Calender() {
  const checkboxDelRef = useRef(null);
  const savedRecepiesRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);


/**
   * useEffect hook that runs when the component mounts and when the user or loading state changes.
   * If the user is not logged in, it will navigate to the home page. Otherwise, it will fetch the user's
   * name, liked recipes, and own calendar. It will also set up a listener for changes to the user's calendar
   * and create a draggable object for saved recipes.
   * @returns None
   */
useEffect( () => {
  if (loading) return;
  if (!user) return navigate ("/");
 

  if(user) {
    setIsLoading(false);
    setLoggedIn(true);
    fetchLikedRecipes();
    fetchOwnCalender();

   

    const refCollectionCalender = collection(db,"users", user?.uid,"Calender");
    const updateCalender = onSnapshot(refCollectionCalender, (snapshot) => {
      
      fetchOwnCalender();
      
    });
  

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
   
     };
  }
 
}, [user,loading]);


  /**
   * Handles the click event on a calendar event. If the delete checkbox is checked, the recipe
   * is removed from the database and the event is removed from the calendar. Otherwise, the URL
   * associated with the recipe is opened in a new tab.
   * @param {Object} clickedEvent - the event object that was clicked
   * @returns None
   */
  const handleClickedEvent = (clickedEvent) =>{
    const clicked = clickedEvent.event.title;
    const claId = clickedEvent.event.id;
    clickedEvent.jsEvent.preventDefault();
    if (checkboxDelRef.current.checked){
      removeRecpieFromDatabase(claId);
      clickedEvent.event.remove();
    }else{
      
      const index = items.findIndex( i => i.name.trim().toLowerCase() == clicked.trim().toLowerCase());
      if(index !== -1) {
        const url = items[index]['url']
        window.open(url,"_blank");
    }
    }
   

  };


  /**
   * Fetches the list of liked recipes for the current user and sets the state with the response.
   * @returns None
   */
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

    }
    catch(err) {
      console.error(err);
    }

  };


  /**
   * Fetches the user's own calendar and formats the events to be displayed on the calendar.
   * @returns None
   */
  const fetchOwnCalender = async () => {
    try {
      let allData = [];
      let calendarList = await fetchCalender(user.uid);
  
      for (const event of calendarList) {
        if (!event['allDay']) {
 	        let end = event['endStr'];
           let startTime =event['startStr']
          if(end !== ""){
            let time = end.toDate();
            let isoDateTime = new Date(time.getTime() - (time.getTimezoneOffset() * 60000)).toISOString();
            isoDateTime = isoDateTime.slice(0, -5);
            event['endStr'] = isoDateTime;
            event.end = isoDateTime;
          }
          else{
            let startTime =event['startStr'];
            event.end = startTime;
          }
          event.start = startTime;

          allData.push(event);
        } else {
          allData.push(event);
        }
      }
  
      setEvents(allData);
    } catch (err) {
      console.error(err);
    }
  }
 
  /**
   * Handles the changed event and updates the event in the database.
   * @param {Object} changedEvent - The changed event object.
   * @returns None
   */
  const handleChangedEvent = (changedEvent) =>{
    const isAllDay = changedEvent.event.allDay;
    const id = changedEvent.event.id;
    let startTime;
    let endTime;
    let date = (changedEvent.event.startStr).split('T');
    date = date[0]

    // new starttime 
    if(isAllDay){
      startTime = changedEvent.event.startStr;
      endTime = changedEvent.event.startStr;
     
    }else{
      startTime = changedEvent.event.startStr;
      endTime = changedEvent.event.endStr;
    }

    try{
      let temp = updateEvent(user.uid,id, startTime, endTime, isAllDay,date).then((response) =>{
      })
    }catch (err){
      console.error(err);

    }
  }
    
  if (isLoading &&  !name  && !savedRecepiesRef) {
    return <div>Loading...</div>;
  }

  /**
   * Logs the user out of the application and navigates to the calendar page.
   * @returns None
   */
  const changeLogOut = async () => {
    try {
      logout();
      setLoggedIn(false); // set loggedIn to false when user logs out
      navigate("/calender");
    } catch (err) {
      console.error(err);
    }
  };


  const addRecipeToDatabase = (id, title, url, date, startStr, endStr, allDay) =>{
    try{
      let temp = addRecipeCalender(user.uid,id, title, url, date, startStr, endStr, allDay ).then((response) => {
      })
    }catch (err){
      console.error(err);

    }
  };

  const removeRecpieFromDatabase = (claId) => {

    try{
      let recipeCalendar = removeEventCal(user.uid,claId).then((response) => {
      })
      
    }catch (err){
      console.error(err);

    }
  };
  
  /**
   * Handles a new event created in the calendar by extracting the necessary information
   * and adding it to the database.
   * @param {Object} newEvent - the new event object created in the calendar
   * @returns None
   */
  const handleNewEvent = async (newEvent) => {
    const title = newEvent.draggedEl.innerText;
    const isAllDay = newEvent.allDay;
    let date;
  
    if (isAllDay) {
      date = newEvent.dateStr;
    } else {
      date = newEvent.dateStr;
      date = new Date(date);
      date = date.getFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
    }
  
    let startDate = newEvent.dateStr;
    let endDate = newEvent.date;
    let url;
    const index = items.findIndex((i) => i.name.trim().toLowerCase() === title.trim().toLowerCase());


    if (index !== -1) {
      url = items[index].url;
      
    }
    const id = uuidv4();
    
  
    addRecipeToDatabase(id, title, url, date, startDate, endDate, isAllDay);
  };
  

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
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
          events={events}
         
          
          drop={handleNewEvent}
          eventDrop={handleChangedEvent}
          eventClick={handleClickedEvent}

        />
          
      </div>
      
      <div className='removeEvent'>
      <p>
          <input type='checkbox' id='event-remove'  ref={checkboxDelRef}/>
          <label htmlFor='event-remove'>Remove from calendar?</label>
        </p>
      </div>
      </div>
      </div>
    </div>
  );
}
export default Calender;

