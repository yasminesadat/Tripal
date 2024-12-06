import React, { useState, useEffect } from 'react';
import { Bell, X, Heart } from 'lucide-react';
import { getTouristNotifications } from '@/api/TouristService';

const NotificationTab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const notifications = await getTouristNotifications();
            setNotifications(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
        setLoading(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-[#dac4d0] transition-all duration-300 transform hover:scale-105 group"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-[#8f5774] group-hover:animate-bounce" />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-[#e0829d] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white animate-pulse">
                        {unreadCount}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 translate-x-[+10000%] mt-2 w-64 shadow-lg bg-white rounded-2xl border-2 border-[#dac4d0] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between p-3 bg-[#e5f8f8] border-b border-[#dac4d0]">
                        <h3 className="text-sm font-semibold text-[#8f5774] flex items-center gap-1">
                            Notifications <Heart className="w-3 h-3 text-[#e0829d] animate-pulse" />
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-[#036264] hover:text-[#e0829d] transition-colors duration-300 rounded-full p-1 hover:bg-[#dac4d0]"
                            aria-label="Close notifications"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto bg-gradient-to-b from-white to-[#e5f8f8]">
                        {loading ? (
                            <div className="p-6 text-center text-[#036264] text-sm">
                                <div className="animate-bounce mb-2">✨</div>
                                Loading...
                            </div>
                        ) : notifications.length > 0 ? (
                            <div>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 border-b border-[#dac4d0] hover:bg-[#dac4d0]/20 transition-colors duration-300 ${notification.unread ? 'bg-[#e5f8f8]/50' : ''
                                            }`}
                                    >
                                        <div className="text-sm font-medium text-[#8f5774] mb-1 flex items-center gap-2">
                                            {notification.notifType === 'birthday' && '🎀'}
                                            {notification.notifType === 'events' && '✨'}
                                            {notification.message}
                                            {notification.read && (
                                                <span className="ml-auto text-[10px] bg-[#e0829d] text-white px-2 py-0.5 rounded-full">New</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#036264] mb-1 pl-5">{notification.content}</p>
                                        <span className="text-[10px] text-[#5a9ea0] pl-5">{notification.time}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-[#036264] text-sm">
                                <div className="mb-2">🌸</div>
                                All caught up!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationTab;