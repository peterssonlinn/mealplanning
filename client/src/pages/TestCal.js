import React, { useEffect } from 'react';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';


const TestCal = () => {
    useEffect(() => {
        // Initialize and render FullCalendar
        var containerEl = document.getElementById('external-events');
        var calendarEl = document.getElementById('calendar');
    
        new Draggable(containerEl, {
          itemSelector: '.fc-event',
          eventData: function(eventEl){
            return {
              title: eventEl.innerText
            };
          }
        });
    
        var calendar = new Calendar(calendarEl, {
            plugins:[timeGridPlugin, interactionPlugin],
            initialView:'timeGridWeek',
            weekends:true,
            headerToolbar:{// Customize header toolbar
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay' // Add timeGridWeek and timeGridDay as options
            },
            editable:true,
            droppable:true
        });
        calendar.render();
    
      }, []);
  return (
    <div>
      <div id='external-events'>
  <p>
    <strong>Draggable Events</strong>
  </p>

  <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
    <div class='fc-event-main'>My Event 1</div>
  </div>
  <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
    <div class='fc-event-main'>My Event 2</div>
  </div>
  <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
    <div class='fc-event-main'>My Event 3</div>
  </div>
  <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
    <div class='fc-event-main'>My Event 4</div>
  </div>
  <div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
    <div class='fc-event-main'>My Event 5</div>
  </div>
</div>

<div id='calendar-container'>
  <div id='calendar'></div>
</div>
    </div>
  );
};

export default TestCal;
