import { useState, useEffect } from "react"; 
import { message } from "antd";
import { Bell, Check, X } from "lucide-react";
import { deleteNotifications, getNotifications, markNotification } from "@/api/AdvertiserService";

export default function AdvertiserNotification() {

  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  const unreadCount = notifications.filter((n) => !n.read).length;
  const handleNotificationRead = async(id) => {
    try{
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    await markNotification(id);
  }
  catch(error){
    message.error(error);
  }
  };

  const handleNotificationRemove = async(id) => {
    try{
     setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
     await deleteNotifications(id);
        } catch(error){
          message.error(error);
        }
  };
  return (
    <>
            {/* Notifications Button */}
            <div className="relative ml-30">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="d-flex">
                <Bell className="text-18" style={{ color: 'var(--color-dark-purple)' }} />
                {unreadCount > 0 && (
                  <span className="absolute countposition text-black rounded-full px-3 py-1 text-xs countposition2" style={{ color: 'var(--color-dark-purple)' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="dropdown-menu2">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold" style={{ color: 'var(--color-dark-purple)' }} >Notifications</h3>
                      <span className="text-sm text-gray-500" style={{ color: 'var(--color-dark-purple)' }} >{unreadCount} unread</span>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No notifications</p>
                    ) : (
          <ul>
            {notifications.map((notification) => (
             <li key={notification.id} className={`flex justify-between items-center p-4 mb-2 border rounded-md ${!notification.read ? 'bg-gray-100' : ''}`}>
             <div className="flex-grow">
               <span className={notification.read ? '' : 'font-boldNotification'}>
                {notification.message}
                </span>
             </div>
           
             {/* Flex container for the check and X icons */}
             <div className="check-x-container">
               <Check
                 className="h-4 w-4 text-red-500 cursor-pointer hover:text-green-500"
                 onClick={() => handleNotificationRead(notification.id)}
               />
               <X
                 className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700"
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