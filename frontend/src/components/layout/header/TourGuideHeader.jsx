import { useState, useEffect } from "react";
import Menu from "../components/TourGuideMenu";
import { profile } from "@/data/tourGuideMenu";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { logout } from "@/api/UserService";
import TourGuideNotification from "@/components/common/NotificationsTourGuide";

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

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      const transformedData = response.map((notification) => ({
        id: notification._id,
        message: notification.message,
        read: notification.read
      }));
      setNotifications(transformedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

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
  const handleNotificationRead = async (id) => {
    try {
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
      const response = await markNotification(id);
    }
    catch (error) {
      message.error(error);
    }
  };

  const handleNotificationRemove = async (id) => {
    try {
      setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
      const response = await deleteNotifications(id);

    } catch (error) {
      message.error(error);
    }
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
      <header className={`header -type-3 js-header ${addClass ? "-is-sticky" : ""}`}>
        <div className="header__container container">
          <div className="headerMobile__left">
            <button onClick={() => setMobileMenuOpen(true)} className="header__menuBtn js-menu-button">
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
            <button onClick={() => pageNavigate("/tour-list-1")} className="d-flex">
              <i className="icon-search text-18"></i>
            </button>

            <button onClick={() => pageNavigate("/login")} className="d-flex ml-20">
              <i className="icon-person text-18"></i>
            </button>
          </div>

          <div className="header__right">
          
            <TourGuideNotification/>


            <Link to="/help-center" className="ml-20">
              Help
            </Link>


            <button onClick={() => setMobileMenuOpen(true)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`button -sm -outline-dark-1 rounded-200 text-dark-1 ml-30 ${dropdownOpen ? "hovered" : ""}`}>
              <i className="icon-person text-18"></i>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
          top: 40px;
          left: -160px;
          right: 0;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 10px;
          z-index: 1000;
          min-width: 350px; /* Width of the notification list */
          max-height: 400px; /* Set a max height for the dropdown */
          overflow-y: auto; /* Allow scrolling when content exceeds max-height */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
/* The entire scrollbar */
::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
  height: 8px; /* Height for horizontal scrollbar */
}

/* The track of the scrollbar */
::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* Light gray background for the track */
  border-radius: 10px; /* Rounded corners for the track */
}

/* The draggable part of the scrollbar (the thumb) */
::-webkit-scrollbar-thumb {
  background-color: var(--color-dark-purple); 
  border-radius: 10px; /* Rounded corners for the thumb */
}

/* Hover effect on the thumb */
::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-light-purple); /* Darker blue when hovered */
}

        .dropdown-menu {
          position: absolute;
          top: 90%;
          left: 87%;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 10px; 
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
        }

        /* Styling for each notification */
        .dropdown-menu2 ul {
          padding: 0;
        }

        .countposition2{
           margin-left:10px
        }

        .font-boldNotification {
  font-weight: bold;
}

       .dropdown-menu2 li {
  display: flex;
  justify-content: space-between; /* Pushes content to both ends */
  align-items: center; /* Vertically aligns items */
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 70px;
}

.dropdown-menu2 .flex-grow {
  flex-grow: 1; /* This ensures the text grows to take up available space */
}

.dropdown-menu2 .check-x-container {
  display: flex;
  gap: 10px; /* Space between the check and x icons */
}

.check-x-container .cursor-pointer {
  cursor: pointer;
}

.check-x-container .text-red-500 {
  color: var(--color-pink);
}



.check-x-container .cursor-pointer:hover {
  color:var(--color-light-purple); /* Color for x mark */
}

      `}</style>
    </>
  );
}
