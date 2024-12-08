import { useState, useEffect } from "react";
import {
  LineChart,
  Tooltip,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { getRevenue } from "@/api/ActivityService"; 
import  {getAdvertiserBookings} from "@/api/ActivityService";
export default function ActivityRevenue() {
  const [revenueData, setRevenueData] = useState([]); 
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [tabs, setTabs] = useState([{ label: "Revenue", data: [] }, { label: "Bookings", data: [] }]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [totalTickets, setTotalTickets] = useState(null);
  const generateRandomPastDate = (start, end) => {
    const startDate = new Date(start.getTime());
    const randomDate = new Date(startDate.getTime() + Math.random() * (end.getTime() - startDate.getTime()));
    return randomDate.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  };
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const revenueResponse = await getRevenue();
        console.log("Revenue Data:", revenueResponse);
        setTotalRevenue(revenueResponse.totalRevenue);
        const formattedData = [
            { name: "Week 1", value: revenueResponse.totalRevenue * 0.25 }, 
            { name: "Week 2", value: revenueResponse.totalRevenue * 0.30 }, 
            { name: "Week 3", value: revenueResponse.totalRevenue * 0.20 }, 
            { name: "Week 4", value: revenueResponse.totalRevenue * 0.25 }, 
          ];
        console.log("fomrated data: ",formattedData)
        setRevenueData(formattedData);
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.label === "Revenue"
              ? {
                  ...tab,
                  data: formattedData,
                }
              : tab
          )
        );
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchRevenue();
   
  },[]);
  useEffect(() => {
    
    const getAdvertiserBooking = async () => {
      try {
        const AdvertiserBooking = await getAdvertiserBookings();
        console.log("Revenue :", AdvertiserBooking.data.flat());
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1); // 1 year in the past
        const endDate = new Date();
        const updatedBookings = AdvertiserBooking.data.flatMap(item =>
          item.bookings.map(booking => ({
            name: generateRandomPastDate(startDate, endDate),
            value: booking.tickets
          }))
        );
        const totalTickets = updatedBookings.reduce((total, item) => total + item.value, 0);
        console.log("tba", updatedBookings);
        setTotalTickets(totalTickets);
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.label === "Bookings"
              ? {
                  ...tab,
                  data: updatedBookings,
                }
              : tab
          )
        );
        

} catch (error) {
  console.error("Error fetching bookings:", error);
}
    };

    
    getAdvertiserBooking();
  },[]);
  useEffect(() => {
    setActiveTab((preTab)=>(
     preTab.label==="Revenue"? tabs[0]:tabs[1]
    ));
   }, [tabs]);

  const chart = (interval) => (
    <ResponsiveContainer height={500} width="100%">
      <LineChart data={activeTab.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis tick={{ fontSize: 12 }} dataKey="name" interval={interval} />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={[0, "auto"]} // Auto-adjust Y-axis
          tickCount={7}
          interval={interval}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          stroke="#336CFB"
          fill="#336CFB"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="col-xl-8 col-lg-12 col-md-6">
    <div className="rounded-12 bg-white shadow-2 h-full">
      <div className="pt-20 px-30">
      <div className="tabs -underline-2 js-tabs">
      <div className="d-flex items-center justify-between">
        <div className="tabs__controls row x-gap-20 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabs.map((elm, i) => (
            <div
              onClick={() => setActiveTab(elm)}
              key={i}
              className="col-auto"
            >
              <button
                className={`tabs__button fw-500 px-5 pb-5 lg:pb-0 js-tabs-button ${activeTab.label === elm.label ? "is-tab-el-active" : ""
                  }`}
              >
                {elm.label}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="tabs__content pt-30 js-tabs-content">
              <div className="tabs__pane -tab-item-1 is-tab-el-active">
              {activeTab.label ==="Revenue" && 
              <div className="text-18 fw-500">Weekly Revenue Statistics
              <h3>Total Revenue: {totalRevenue}</h3></div>} 
              {activeTab.label ==="Bookings" && 
              <div className="text-18 fw-500">Bookings Statistics
              <h3>Total Tickets : {totalTickets}</h3></div>} 
                {chart("preserveEnd")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
