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
    {title : 'Chicken stew',
    date: '2023-04-20T12:00:00'                
  },{
    title: 'Korvstroganoff',
    date: '2023-04-22T17:30:00'
  }
];

  useEffect(() => {
    const containerEl = savedRecepiesRef.current;
    const calendarEl = calendarRef.current;
    const checkbox = checkboxRef.current;

    const draggable = new Draggable(containerEl, {
      itemSelector: '.fc-event',
      eventData: function(eventEl) {
        return {
          title: eventEl.innerText
        };
      }
    });

    const calendar = calendarEl.getApi();

    calendar.setOption('plugins', [dayGridPlugin, timeGridPlugin, interactionPlugin]);
    calendar.setOption('headerToolbar', {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    });
    calendar.setOption('editable', true);
    calendar.setOption('droppable', true);
    calendar.setOption('weekends', true)
    calendar.setOption('events', events)
    calendar.setOption('height', 600);    
    calendar.setOption('drop', function(info) {
      if (checkbox.checked) {
        info.draggedEl.parentNode.removeChild(info.draggedEl);
      }
    });

    return () => {
      draggable.destroy();
      calendar.destroy();
    };
  }, []);

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
        </div>
        </div>
      </div>

      <div id='calendar-container'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        />
      </div>
    </div>
  );
}

export default TestCal;
