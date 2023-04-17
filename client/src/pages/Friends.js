import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import React, { useState } from 'react';
//import 'react-calendar/dist/Calendar.css';

function Friends() {
  const [value, setValue] = useState(new Date());

  function onChange(nextValue) {
    setValue(nextValue);
  }

  return (

    <div className='App'>

    
    <div className='backgroundApp'>

        <div>
        <h1>Welcome to the Friends page!</h1>
        </div>
        <div>
      <Calendar onChange={onChange} value={value} />
    </div>
    </div>
    </div>
  );
}

export default Friends;