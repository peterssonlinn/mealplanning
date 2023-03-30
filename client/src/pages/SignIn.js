import { Link } from 'react-router-dom';

function SignIn() {
  return (
    <div>
      <h1>Welcome to the SignIn page!</h1>
      <p>This is where you can find information about our company.</p>
      <nav>
        <ul>
          <li><Link to="/Home">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default SignIn;