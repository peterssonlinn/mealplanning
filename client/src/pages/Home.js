import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Home page!</h1>
      <p>This is where you can find information about our company.</p>
      <nav>
        <ul>
          <li><Link to="/SignIn">SignIn</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>


    <Link to="/SignIn">
      <button type="button">
            Click Me!
      </button>
      </Link>


      <Link 
      className="btn btn-pink"
      role="button"
      to="/SignIn"
      > 
      Button1
      </Link>

    </div>
  );
}

export default Home;
