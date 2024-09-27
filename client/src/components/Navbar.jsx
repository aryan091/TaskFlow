import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import User from "../assets/images/user.png";
import { useAuth } from "../context/AuthContext"; 

const NavBar = () => {
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const { currentUser, logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    setToggleDropDown(false); 
  };

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link to="/" className="flex gap-2 flex-center">
        <img
          src={Logo}
          alt="GenPrompts Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">TaskFlow</p>
      </Link>

      <div className="sm:flex hidden">
        {currentUser ? (
          <div className="flex gap-3 md:gap-5">
            <Link to="/create-task" className="black_btn">
              Create Task
            </Link>
            <button type="button" className="outline_btn" onClick={handleLogout}>
              Sign Out
            </button>
            <Link to="/">
              <img
                src={User}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            
          </>
        )}
      </div>

      <div className="sm:hidden flex relative">
        {currentUser ? (
          <div className="flex">
            <img
              src={User}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropDown((prev) => !prev)} 
            />
            {toggleDropDown && (
              <div className="dropdown">
               
                <Link to="/tasks" className="dropdown_link" onClick={() => setToggleDropDown(false)}>
                  Create Task
                </Link>
                <button
                  type="button"
                  className="mt-5 w-full black_btn"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
