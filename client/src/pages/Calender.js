import React, {useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import DehazeIcon from '@mui/icons-material/Dehaze';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';

import Diversity1Icon from '@mui/icons-material/Diversity1';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FullCalendar from '@fullcalendar/react'

import NavBar from './NavBar';
import { Interaction } from '@fullcalendar/core/internal';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useDrag, useDrop} from 'react-dnd';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import TestCal from './TestCal';






function Calender() {
  
    const calendarRef = useRef(null);

    const events = [ 
      {title : 'ecipipe',
      date: ''
                    
    }];
    const [open, setOpen] = React.useState(false);

    
    /*const Event = ({ title }) => {
      const [{isDragging}, drag] = useDrag({
        type: 'events',
        item: () => ({id: title}),
        collect: monitor => ({
          isDragging: !!monitor.isDragging()
        })
      });
    
    return(
      <div ref={drag} style={{opacity : isDragging ? 0.5 : 1}}>
        {title}
      </div>
    );
    };

    const Drop = () => {
      const calendarRef = useRef(null);
      const [selectDate, setSelectedDate] = useState(null); 
      const [{canDrop, isOver}, drop] = useDrop({
        accept: 'events',
        drop: (item, monitor) => {
          const calendarApi = calendarRef.current.getApi();
          const dropDate = monitor.date || new Date();
          console.log(dropDate)
          if(dropDate){
          const hasTime = dropDate.getHours() !== 0 || dropDate.getMinutes() !== 0 || dropDate.getSeconds() !== 0;
          calendarApi.addEvent({
            title: item.title,
            start: dropDate,
            allDay: !hasTime
          });
        }
          // if (!hasTime){
         // dropDate.setHours(23, 59, 59);
        //}
        
          setSelectedDate(null);
        },
        collect: monitor => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver()
        })
      });
      const handleDateSelect = info => {
        setSelectedDate(info.start);
      }

      return (
        <div ref={drop} className={canDrop && isOver ? 'drop-hover' : ''}>
          DRAG and drop here
          <div className='calenderTest'>
          <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView='timeGridWeek'
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          headerToolbar={{ // Customize header toolbar
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay' // Add timeGridWeek and timeGridDay as options
          }}
          editable={true}
          droppable={true}
          eventStartEditable={true}
          select={handleDateSelect}
        />
        </div>
        <div className='favRecipies'>
          <textbox>
            Hearted recepies here !! 
          </textbox>
        </div> 
        </div>
      );
    };*/

    const handleDateClick = (arg) => {
      alert(arg.dateStr);
    }

    const theme = createTheme({
      palette: {
        primary: {
          // Purple and green play nicely together.
          main: indigo[500],
        },
        secondary: {
          // This is green.A700 as hex.
          main: '#11cb5f',
        },
        
  
      },
    })

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }



  return (
    <div className='App'>
    <div className='backgroundApp'>
      <div>
        {/* Render the NavBar component */}
        <NavBar />
      </div>
        <div>
        {/* Render the NavBar component */}
        <TestCal />
      </div>
    </div>
    
    </div>
  );
}
export default Calender;

