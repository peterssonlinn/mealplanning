import { Link } from 'react-router-dom';
import React, {useState} from 'react';
import '../../src/App.css';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import DehazeIcon from '@mui/icons-material/Dehaze';
import SearchIcon from '@mui/icons-material/Search';



function Home() {

  const [inputValue, setInputValue] = useState('');
  


  const handleClick = () => {
    console.log(inputValue);
    setInputValue("");

  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

 

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
  });
  

  return (
    <div className='App'>
      <div className='headerSignAvaliable'> 
        <ThemeProvider theme={theme}>
            <Button size='medium' color="primary" variant="contained" startIcon={<DehazeIcon />} />
          </ThemeProvider>
       
        <h1 className='header'>Mealplanner</h1>
        
        <ThemeProvider theme={theme}>
          <Button size='small' color="primary" variant="contained" startIcon={<AccountCircle />}>
            Sign In
          </Button>
        </ThemeProvider>

    

      </div>

     
      <div className='searchTextBtn'>
        <input className='search' type="text" value={inputValue} onChange={handleInputChange} />

        <ThemeProvider theme={theme}>
          <Button onClick={handleClick} size='small' color="primary" variant="contained" startIcon={<SearchIcon />} />
        </ThemeProvider>

      </div>
    </div>
  );
}

export default Home;
