import { Link } from 'react-router-dom';
import React, {useState} from 'react';
import '../../src/App.css';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import DehazeIcon from '@mui/icons-material/Dehaze';
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


function NavBar() {

const [open, setOpen] = React.useState(false);

const clickDropdown = () => {
    setOpen((prev) => !prev);
  };

  const clickDropdownAway = () => {
    setOpen(false);
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

<div className = 'dehazeClass'>
<ThemeProvider theme={theme}>
  <ClickAwayListener onClickAway={clickDropdownAway}>
  <Box  sx={{ position: 'relative' }} className='boxDropdown'>
  <Button size='15px' color="primary" onClick={clickDropdown} variant="contained" startIcon={<DehazeIcon />} />
    {open ? (
      <Box className='boxDropdown'>
        <FormControl fullWidth>
        <MenuItem  component={Link} to="/">
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
          </MenuItem>

        <MenuItem  component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem  component={Link} to="/calender">
          <ListItemIcon>
            <CalendarMonthIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Calender</ListItemText>
        </MenuItem>

        <MenuItem  component={Link} to="/friends">
          <ListItemIcon>
            <Diversity1Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Friends</ListItemText>
        </MenuItem>

        <MenuItem  component={Link} to="/settings">
          <ListItemIcon>
            <ManageAccountsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        
        </FormControl>
      </Box>
    ) : null}
  </Box>
</ClickAwayListener>
</ThemeProvider>
</div>
);
}
export default NavBar;