import { Link } from 'react-router-dom';
import React from "react"
import axios from "axios";



function Settings() {

    const[data, setData] = React.useState(null);

    React.useEffect(() => {
      axios
      .get("/api/recipes/?search=italienskt")
      .then(({ data }) => {
        setData(data);
      })
      
     
      
    }, []);


    return (
      <div className='App'>
          <div className='backgroundApp'>
              <div>
              <h1>Welcome to the Settings page!</h1>
              <p>{!data ? "LOADING...":data}</p>
              
              </div>
          </div>
      </div>
    );
}

export default Settings;