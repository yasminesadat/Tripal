import { useState,useEffect } from "react";
import Menu from "../components/TourGuideMenu";
import { profile } from "@/data/tourGuideMenu";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { logout } from "@/api/UserService";
import { Bell, Check, X } from "lucide-react";
import { getNotifications } from "@/api/TourGuideService";

export default function TourGuideHeader() {
  const navigate = useNavigate();

  const pageNavigate = (pageName) => {
    navigate(pageName);
  };

  const [, setMobileMenuOpen] = useState(false);
  const [addClass] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);


  // Sample notifications data
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async ()=>{
    try{
  
      const response = await getNotifications();
    
    const transformedData= response.map((notification) => ({
       id:notification._id,
        message:notification.message,
        read:notification.read
      })
    );

    setNotifications(transformedData);
  }
  catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

useEffect(() => {
  fetchNotifications();
}, []);


  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  let closeTimeout;

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setDropdownOpen(true);
  };

  // Notification handling methods
  const handleNotificationRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleNotificationRemove = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.status === "success") {
      window.location.href = "/login";
    } else {
      message.error(result.message);
    }
  };

  return (
    <>
      <header
        className={`header -type-3 js-header ${addClass ? "-is-sticky" : ""}`}
      >
        <div className="header__container container">
          <div className="headerMobile__left">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="header__menuBtn js-menu-button"
            >
              <i className="icon-main-menu"></i>
            </button>
          </div>

          <div className="header__logo">
            <Link to="/tourguide" className="header__logo">
              <img src="/img/general/logo.svg" alt="logo icon" />
            </Link>

            <Menu />
          </div>

          <div className="headerMobile__right">
            <button
              onClick={() => pageNavigate("/tour-list-1")}
              className="d-flex"
            >
              <i className="icon-search text-18"></i>
            </button>

            <button
              onClick={() => pageNavigate("/login")}
              className="d-flex ml-20"
            >
              <i className="icon-person text-18"></i>
            </button>
          </div>

          <div className="header__right">
            <Link to="/" className="ml-20">
              Help
            </Link>

            {/* Notifications Button */}
            <div className="relative ml-30">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="d-flex"
              >
                <Bell className="text-18" />
                {unreadCount > 0 && (
                 <span classname ="absolute -top-2 -right-2 bg-red-500 text-red-700 rounded-full px-3 py-1 text-xs">
                 {2}
               </span>
               
                )}
              </button>

              {notificationsOpen && (
                <div className="dropdown-menu2">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">Notifications</h3>
                      <span className="text-sm text-gray-500">
                        {unreadCount} unread
                      </span>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No notifications</p>
                    ) : (
                      <ul>
                        {notifications.map((notification) => (
                          <li 
                            key={notification.id} 
                            className={`flex justify-between items-center p-2 ${
                              !notification.read ? 'bg-gray-100' : ''
                            }`}
                          >
                            <span>{notification.message}</span>
                            <div className="flex space-x-2">
                              <Check 
                                className="h-4 w-4 text-green-500 cursor-pointer"
                                onClick={() => handleNotificationRead(notification.id)}
                              />
                              <X 
                                className="h-4 w-4 text-red-500 cursor-pointer"
                                onClick={() => handleNotificationRemove(notification.id)}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(true)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`button -sm -outline-dark-1 rounded-200 text-dark-1 ml-30 ${
                dropdownOpen ? "hovered" : ""
              }`}
            >
              <i className="icon-person text-18"></i>
            </button>
            {dropdownOpen && (
              <div
                className="dropdown-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ul>
                  {profile.map((item) => (
                    <li key={item.id}>
                      {item.title === "Log Out" ? (
                        <a onClick={handleLogout}>{item.title}</a>
                      ) : (
                        <a href={item.href}>{item.title}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      <style>{`
        .button.hovered {
          background-color: var(--color-dark-1) !important;
          color: white !important;
        }

        .dropdown-menu2 {
          position: absolute;
          top: 90%;
          left: auto;
          right: 0;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 10px;
          z-index: 1000;
          min-width: 250px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .dropdown-menu {
          position: absolute;
          top: 90%;
          left: 87%;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 10px; /* Added border-radius for rounded corners */
          z-index: 1000;
        }

        .dropdown-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .dropdown-menu li {
          padding: 10px 20px;
          cursor: pointer;
        }

        .dropdown-menu a {
          text-decoration: none;
          color: inherit;
        }`}</style>
    </>
  );
}
