import { Link } from 'react-router-dom';
import React, {useState} from 'react';
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
import dayGridPlugin from '@fullcalendar/daygrid'
import NavBar from './NavBar';

function Calender() {

    const events = [
        { title: 'recipe'}
      ]

      const [open, setOpen] = React.useState(false);

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
  return (

    

    <div className='App'>
    <div className='backgroundApp'>

        <div className='calenderTest'>
        <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={events}
        eventContent={renderEventContent}
      />
      </div>
      <div>
      {/* Render the LogoutButton component */}
      <NavBar />
    </div>
        
    </div>
    </div>
  );
}

function renderEventContent(eventInfo) {
    return (
      <>
        <p>{eventInfo.event.title}</p>
      </>
    )
  }
export default Calender;