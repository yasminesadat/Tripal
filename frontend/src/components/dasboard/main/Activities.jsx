import { adminNotification,notificationData } from "@/data/dashboard";
import {useState,useEffect} from "react";
import { getAdminNotifications } from "@/api/AdminService";

export default function Activities() {

  const [notification, setNotification] = useState([]); 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getAdminNotifications(2024);
        setNotification(response);

   
       
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    

    fetchNotifications();
  },[]);

  
  
  return (
    <>
    <div className="row y-gap-30 pt-30">
      <div className="col-12" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {/* Make the container scrollable */}
        {notification.map((elm, i) => (
          <div key={i} className="d-flex items-center mb-20"> {/* Added mb-20 for spacing between items */}
            <div className="flex-center size-40 bg-accent-1-05 rounded-full">
              <i className={`${elm.icon} text-16`}></i>
            </div>

            <div className="lh-14 ml-10">{elm.message}</div>
          </div>
        ))}
      </div>
    </div>
  



<style>{`

.scrollable-container {
  scroll-behavior: smooth;
}


`}</style>
</>  );
}
