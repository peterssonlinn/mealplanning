import { Link } from 'react-router-dom';
import React from "react"


function Settings() {

    const[data, setData] = React.useState(null);

    React.useEffect(() => {
      fetch("/api")
      .then((res) =>res.json())
      .then((data) => setData(data.message));
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