import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "./styles/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar() {
  return (
    <div className="navbar">
      <header>
        <a href="/" className="logo">
          <FontAwesomeIcon icon={faHouse} />
        </a>

        <ul className="nav">
          <li>
            <a href="/register">Get Started</a>
          </li>
          <li>
            <a href="/login">login</a>
          </li>
        </ul>
      </header>
    </div>
  );
}

export default Navbar;
