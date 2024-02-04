import { faBars, faHouse, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./styles/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useAuthStore, useLocalStorage, useSideBar } from "../store/zusStore";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { brown, deepOrange } from "@mui/material/colors";

const BasicNav = () => {
  const [menuOpen, setmenuOpen] = useState(false);

  return (
    <div className="nv">
      <div className="navbar">
        <header>
          <a href="/" className="logo">
            <FontAwesomeIcon icon={faHouse} />
          </a>

          <div className="links">
            <ul className="list">
              <li className="listItem signup">
                <a href="/username">Get Started</a>
              </li>
              <li className="listItem">
                <a href="/login">login</a>
              </li>
            </ul>

            <FontAwesomeIcon
              className="menu"
              icon={faBars}
              onClick={() => {
                //   menuOpen ? console.log("opened") : console.log("closed");
                setmenuOpen(!menuOpen);
              }}
            />
          </div>
          {menuOpen ? (
            <ul className="menuList">
              <li className="listItem signup">
                <a href="/username">Get Started</a>
              </li>
              <li className="listItem">
                <a href="/login">login</a>
              </li>
            </ul>
          ) : (
            ""
          )}
        </header>
      </div>
      <div className="separator">
        <hr className="line" />
      </div>
    </div>
  );
};

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}`,
  };
}

function StandardNav() {
  const { username } = jwtDecode(localStorage.getItem("token"));

  const [onSearch, setOnSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { showSidebar, setShowSidebar } = useSideBar();

  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const searchBoxRef = useRef(null);
  const searchBarRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onSearch) {
        setOnSearch(false);
      }
    };

    const handleOutsideClick = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        !searchBarRef.current.contains(event.target) &&
        onSearch
      ) {
        setOnSearch(false);
      }
    };

    // Add event listeners when the component mounts
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onSearch]);

  return (
    <nav className="nav">
      <div className="sideMenu">
        <FontAwesomeIcon
          icon={faBars}
          onClick={(e) => {
            e.preventDefault();
            setShowSidebar();
            console.log(showSidebar);
          }}
        />
      </div>
      <button
        ref={searchBarRef}
        className="search-bar-button"
        onClick={(e) => {
          e.preventDefault();
          setOnSearch(!onSearch);
        }}
      >
        {" "}
        <span>
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <span className="sch">search</span>
      </button>
      <div
        className={onSearch ? "searchBox visible" : "searchBox"}
        ref={searchBoxRef}
      >
        <div className="searchbar search-section">
          <input
            type="text"
            placeholder="search..."
            name=""
            id=""
            onChange={(e) => {
              e.preventDefault();
              setSearchQuery(e.target.value);
            }}
          />
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              position: "absolute",
              left: "10px",
              top: "5%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
        </div>
        <div className="catagory search-section">
          <button
            className={`catagory-button ${
              activeCategory === "All" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("All")}
          >
            All
          </button>
          <button
            className={`catagory-button ${
              activeCategory === "Tasks" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("Tasks")}
          >
            Tasks
          </button>
          <button
            className={`catagory-button ${
              activeCategory === "Groups" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("Groups")}
          >
            Groups
          </button>
        </div>
        <div className="filters search-section">
          <p>RESULTS</p>
          <p>
            Sort by : <button className="filter-button">{sortBy}</button>
          </p>
        </div>
        <div className="results search-section"></div>
      </div>
      <div className="profile">
        <Avatar
          className="avatar"
          children={username[0][0]}
          sx={{ bgcolor: deepOrange[500], width: 25, height: 25 }}
        />
      </div>
    </nav>
  );
}

function Navbar() {
  const isLogin = useLocalStorage((state) => state.isLogin);
  const setIsLogin = useLocalStorage((state) => state.setIsLogin);
  const [loginStatus, setLoginStatus] = useState(isLogin);

  useEffect(() => {
    setLoginStatus(isLogin);
  }, [isLogin]);

  if (!loginStatus) return <BasicNav />;
  else return <StandardNav />;
}

export default Navbar;
