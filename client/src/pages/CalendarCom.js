import React, { useEffect, useRef, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import {auth, db, logout, fetchRecipeList, addRecpie, removeRecpie} from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import "./CalendarCom.css";


function CalendarCom() {
  const savedRecepiesRef = useRef(null);
  const calendarRef = useRef(null);
  const checkboxRef = useRef(null);
  const checkboxDelRef = useRef(null);
  const [user, error] = useAuthState(auth);
  const [items, setItems] = useState([]);



  const events = [ 
    { id : 'a',
      title : 'Chicken stew',
    date: '2023-04-20T12:00:00'                
  },{
    id : 'b',
    title: 'Korvstroganoff',
    date: '2023-04-22T17:30:00',
    url: 'https://www.ica.se/recept/korvstroganoff-med-ris-533512/'
  }
];
 
  useEffect(() => {
    
    const containerEl = savedRecepiesRef.current;
    //const calendarEl = calendarRef.current;
    const checkbox = checkboxRef.current;
    let calendar = calendarRef.current.getApi();
    //fetchLikedRecipes();
    

    const draggable = new Draggable(containerEl, {
      itemSelector: '.fc-event',
      eventData: function(eventEl) {
        
        return {
          title: eventEl.innerText
        };
      }
    });

    

    calendar.setOption('plugins', [dayGridPlugin, timeGridPlugin, interactionPlugin]);
    calendar.setOption('headerToolbar', {
       left: 'prev,next today',
       center: 'title',
       right: 'dayGridMonth,timeGridWeek,timeGridDay'
     });
    calendar.setOption('editable', true);
    calendar.setOption('droppable', true);
    calendar.setOption('weekends', true);
    calendar.setOption('events', events);
    calendar.setOption('eventBackgroundColor', '#307672');
    calendar.setOption('height', 580);    
    calendar.setOption('firstDay', 1);
    calendar.setOption('eventTimeFormat', 
        { hour: '2-digit',
         minute: '2-digit',
         hour12: false}
     );
     calendar.setOption('timeZone', 'UTC+2');
     calendar.setOption('locale', 'en-SE');
     
     calendar.setOption('drop', function(info) {
       if (checkbox.checked) {
         info.draggedEl.parentNode.removeChild(info.draggedEl);
       }
     });

    calendar.setOption('eventClick', function(info){
      if (checkboxDelRef.current.checked){
        info.event.remove()
      }
      info.jsEvent.preventDefault(); // don't let the browser navigate

      if (info.event.url) {
        window.open(info.event.url);
      }
      
    });

    
    return () => {
      //draggable.destroy();
      //calendar.destroy();
    };

  });
   /*



     <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Recipe 1</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Recipe 2</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Recipe 3</div>
        </div>

        <div className='list-container'>
          <div className='list'>
          {items.map((item, index) => (
                      <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"> 
                        <div key={index} className="fc-event-main">{item}</div>
                      </div>
                ))}
          </div> 
        </div>


              <div id='saved_recepies' ref={savedRecepiesRef}>
        <p>
          <strong>Saved Recipes: </strong>
        </p>
        <p>
          <input type='checkbox' id='drop-remove' ref={checkboxRef} />
          <label htmlFor='drop-remove'>Remove after added to calendar?</label>
        </p>
        <div className='list'>
        
        {items.map((item, index) => (
                      <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"> 
                        <div key={index} className="fc-event-main">{item}</div>
                      </div>
                ))}
                 </div>
        
      </div>

      <div className='removeEvent'>
      <p>
          <input type='checkbox' id='event-remove' ref={checkboxDelRef} />
          <label htmlFor='event-remove'>Remove from calendar?</label>
        </p>
      </div>
  */


 
  return (

    <div>
  
      <div id='calendar'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        />
          
      </div>

     
      <div className='list'>
        <div id='saved_recepies' ref={savedRecepiesRef} >
        <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"> 
            {items.map((item, index) => ( 
                      <div key={index} className="fc-event-main">{item}</div>
              ))}
             </div>
          </div>
         
      </div>
      
    </div>
  );
}

export default CalendarCom;
