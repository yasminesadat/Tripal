import React, { useState, useEffect } from 'react';
import { Bell} from 'lucide-react';
import { format } from 'date-fns';
import { markNotification, getNotifications } from "@/api/AdvertiserService";


const AdvertiserNotification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    var unreadCount = notifications.filter(n => !n.read).length;

    const fetchNotifications = async () => {
        console.log("hi");
        setLoading(true);
        try {
            const notifications = await getNotifications();
            if (notifications){
           await markNotification();
            // Sort notifications by date in descending order (most recent first)
            const sortedNotifications = [...notifications].sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotifications(sortedNotifications);
            unreadCount = notifications.filter(n => !n.read).length;
        }

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
        setLoading(false);
    };



 
    useEffect(() => {
            fetchNotifications();     
    }, [isOpen]);


 

    return (
        <div className="relative">
            <style jsx>{`
     .notification-panel {
  box-shadow: 0 15px 35px rgba(143, 87, 116, 0.15);
  transform: translateX(-230px) translateY(20px); /* Slide in from left and down */
  opacity: 1; /* Make it fully visible */
  width: 320px !important;
  max-height: 70vh;
background: var(--color-footer);
background-color: var(--color-footer);

color: var(--color-stone);
}

               .notification-badge {
                   animation: pulse 2s infinite;
               }

               @keyframes pulse {
                   0% { transform: scale(1); }
                   50% { transform: scale(1.2); }
                   100% { transform: scale(1); }
               }

               .notification-item {
                   transition: all 0.3s ease;
                   border-left: 2px solid transparent;
                   margin: 4px;
                   border-radius: 6px;
                   background: #fff;
                   box-shadow: 0 1px 4px rgba(218, 196, 208, 0.15);
               }

               .notification-item:hover {
                   border-left-color: #8f5774;
                   background: #e5f8f8;
               }

               .notification-item.unread {
                   border-left-color: #e0829d;
                   background: #fff;
               }

               .scroll-container {
                   max-height: 60vh;
                   overflow-y: auto;
                   background: #f7f7f9;
                   padding: 4px 0;
               }

               .scroll-container::-webkit-scrollbar {
                   width: 4px;
               }

               .scroll-container::-webkit-scrollbar-track {
                   background: #e5f8f8;
               }

               .scroll-container::-webkit-scrollbar-thumb {
                   background-color: #dac4d0;
                   border-radius: 20px;
               }

               .date-divider {
                   padding: 4px 8px;
                   background: #dac4d0;
                   color: #8f5774;
                   font-size: 10px;
                   font-weight: 500;
                   margin: 8px 4px;
                   border-radius: 4px;
               }
           `}</style>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-[#dac4d0] transition-all duration-300"
            >
                <Bell className="w-4 h-4 text-[#8f5774]" />
                {unreadCount > 0 && (
                    <span className="notification-badge absolute -top-1 -right-1 bg-[#e0829d] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-panel absolute right-0 mt-2 bg-white rounded-lg border border-[#dac4d0] z-50">
                    <div className="flex items-center justify-between p-2 bg-[#e5f8f8] rounded-t-lg border-b border-[#dac4d0]">
                        <p className="text-[#8f5774] text-xs flex items-center gap-1">
                            Notifications ({unreadCount})
                        </p>
                    </div>

                    <div className="scroll-container">
                        {loading ? (
                            <div className="p-4 text-center text-[#036264] text-xs">
                                <div className="animate-spin mb-1">✨</div>
                                Loading...
                            </div>
                        ) : notifications.length > 0 ? (
                            <>
                                {notifications.map((notification, index) => {
                                    const date = format(new Date(notification.createdAt), 'MMMM dd, yyyy');
                                    const showDateDivider = index === 0 ||
                                        format(new Date(notifications[index - 1].createdAt), 'MMMM dd, yyyy') !== date;

                                    return (
                                        <React.Fragment key={notification.id}>
                                            {showDateDivider && (
                                                <div className="date-divider">{date}</div>
                                            )}
                                            <div className={`notification-item p-2 ${!notification.read ? 'unread' : ''}`}>
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-1">
                                                        <div className="text-xs text-[#8f5774] mb-1 flex items-center justify-between">
                                                            <span>{notification.message} </span>

                                                        </div>
                                                        <p className="text-[10px] text-[#036264] mb-1">{notification.content}</p>
                                                        <span className="text-[9px] text-[#5a9ea0]">
                                                            {format(new Date(notification.createdAt), 'h:mm a')}
                                                        </span>
                                                        {/* <span
                                                            className="text-[9px] bg-[#e0829d] text-black px-1.5 py-0.5 rounded-full cursor-pointer"
                                                            onClick={() => {
                                                                // Mark the notification as read
                                                                setNotification({ ...notification, read: true });
                                                            }}
                                                        >
                                                            Mark as Read
                                                        </span> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="p-4 text-center">
                                <div className="text-xl mb-1">🌸</div>
                                <p className="text-xs text-[#8f5774] font-medium">All caught up!</p>
                                <p className="text-[10px] text-[#036264] mt-0.5">Check back later</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvertiserNotification;