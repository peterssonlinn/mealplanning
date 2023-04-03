import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../src/App.css';
import background from "../images/background.png";

function Register() {

  return (

    <div className='backgroundApp'>
    <div>
      <h1 className='headerRegister'>Create Account on Mealplanner</h1>
      <div className='returnButtonRegister'>
        <Link to="/">
            <Button size='15px' variant="contained" startIcon={<ArrowBackIcon />} />
        </Link>
      </div>
      
      
     <div className='registerForm'>
        <form>
        <label> Username</label> <br />
        <input type="text" name='username' className='createBox'/> <br />
        <label> Password</label>  <br />
        <input type='password' name='password'  className='createBox'/>  <br />
        <label> Password</label>  <br />
        <input type='password' name='password' className='createBox'/> <br />
        <input type="submit" value="Create account" className='createaccount-btn'/>  <br />
        </form>
      </div>
    </div>
    </div>
  );
}

export default Register;