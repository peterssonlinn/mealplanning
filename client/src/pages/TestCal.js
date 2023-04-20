import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

function TestCal() {
  const savedRecepiesRef = useRef(null);
  const calendarRef = useRef(null);
  const checkboxRef = useRef(null);

  const events = [ 
    { id : 'a',
      title : 'Chicken stew',
    date: '2023-04-20T12:00:00'                
  },{
    id : 'b',
    title: 'Korvstroganoff',
    date: '2023-04-22T17:30:00'
  }
];

  useEffect(() => {
    const containerEl = savedRecepiesRef.current;
    const calendarEl = calendarRef.current;
    const checkbox = checkboxRef.current;
    const calendarApi = calendarRef.current.getApi();
    const calendar = calendarEl.getApi();


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
    calendar.setOption('height', 600);    
    calendar.setOption('eventClick', function handleKeyDown(info){
      if (info.key === "Backspace"){
        console.log("TETSETESTE");
        console.log(calendarApi.view.events.selection)
      if (calendarApi.view.selection) {
        const eventId = calendarApi.view.selection.id;
        console.log(eventId);
        const event = calendarApi.getEventById(eventId);
        //const selectedEvent = calendarApi.view.calendar.getEventById(calendarApi.view.selection.id);
        if (event){
          event.remove();
        }
      }
    }
    });
    window.addEventListener("keydown", handleKeyDown);

    calendar.setOption('drop', function(info) {
      if (checkbox.checked) {
        info.draggedEl.parentNode.removeChild(info.draggedEl);
      }
    });

    return () => {
      draggable.destroy();
      calendar.destroy();
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div>
      <div id='saved_recepies' ref={savedRecepiesRef}>
        <p>
          <strong>Saved Recepies: </strong>
        </p>
        <p>
          <input type='checkbox' id='drop-remove' ref={checkboxRef} />
          <label htmlFor='drop-remove'>Remove after added to calendar?</label>
        </p>
        <div className='list-container'>
          <div className='list'>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepiesfdjgfdlkgj l fdjfsld  spfjdlfk j eoiedfjos ijd lkldfnlkfnd</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>calendar.events</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        <div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
          <div className='fc-event-main'>Will be saved recepies</div>
        </div>
        </div>
        </div>
      </div>

      <div id='calendar'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        />
      </div>
    </div>
  );
}

export default TestCal;
