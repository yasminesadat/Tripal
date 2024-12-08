import Revenue from "@/pages/admin/Revenue";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Tooltip,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
export default function ItineraryBooking({ bookings, price }) {
  const [tabs, setTabs] = useState([{ label: "Revenue", data: [] }, { label: "Bookings", data: [] }]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [revenue, setRevenue] = useState([]);
  const sortOptions = [
    { label: "Monthly", order: "month" },
    { label: "Daily", order: "date" },
  ];
  const [ddActives, setDdActives] = useState(false);
  const [sortOption, setSortOption] = useState("");
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  const dropDownContainer = useRef();
  const generateRandomPastDate = (start, end) => {
    const startDate = new Date(start.getTime());
    const randomDate = new Date(startDate.getTime() + Math.random() * (end.getTime() - startDate.getTime()));
    return randomDate.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  };

  useEffect(() => {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // 1 year in the past
    const endDate = new Date(); // Today
    let updatedBookings = bookings.map((booking) => ({
      name: generateRandomPastDate(startDate, endDate),
      value: booking.tickets,
    }));
    let bookingRevenue = updatedBookings.map((booking) => ({
      fullDate: generateRandomPastDate(startDate, endDate),
      monthDate: new Date(booking.name).toLocaleString('default', { month: 'long' }),
      value: booking.value,
    }));
    setRevenue(bookingRevenue);
    console.log(bookingRevenue)
    let tourguideRevenue = updatedBookings.map((booking) => ({
      name: booking.name,
      value: booking.value * price,
    }));
    setTabs([
      { label: "Revenue", data: tourguideRevenue },
      { label: "Bookings", data: updatedBookings }])
  }, []);
  useEffect(() => {
  setTabs((prevTabs)=>(prevTabs.map((tab) =>
    tab.label === "Revenue"
      ? {
        ...tab,
         data: revenue.map((booking) => ({
          name: sortOption.order === "month" ? booking.monthDate : booking.fullDate,
          value: booking.value,
        }))
      } 
      : tab)
 ))
}, [revenue, sortOption]);
useEffect(() => {
 setActiveTab((preTab)=>(
  preTab.label==="Revenue"? tabs[0]:tabs[1]
 ));
}, [tabs]);
  const chart = (interval) => (
    <ResponsiveContainer height={500} width="100%">
      <LineChart data={activeTab.data}>
        <CartesianGrid strokeDasharray="" />
        <XAxis tick={{ fontSize: 12 }} dataKey="name" interval={interval} />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={[0, 300]}
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
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  );


  return (
    <div className="col-xl-8 col-lg-12 col-md-6">
      <div className="rounded-12 bg-white shadow-2 h-full">
        <div className="pt-20 px-30">
          <div className="tabs -underline-2 js-tabs">
            <div className="d-flex items-center justify-between">
              <div className="text-18 fw-500">Earning Statistics</div>
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
            {activeTab.label === "Revenue" && <div ref={dropDownContainer} className="col-auto" >
              <div
                className={`dropdown -type-2 js-dropdown js-form-dd ${ddActives ? "is-active" : ""
                  } `}
                data-main-value=""
              >
                <div
                  className="dropdown__button js-button"
                  onClick={() => setDdActives((pre) => !pre)}
                >
                  <span>View Revenue</span>
                  <span className="js-title">
                    {sortOption.label ? sortOption.label : ""}
                  </span>
                  <i className="icon-chevron-down"></i>
                </div>

                <div className="dropdown__menu js-menu-items">
                  {sortOptions.map((elm, i) => (
                    <div
                      onClick={() => {
                        setSortOption(elm);
                        setDdActives(false);
                        console.log("tabs",tabs)
                             
                          
                          
                        }}
                  key={i}
                  className="dropdown__item"
                  data-value="fast"
                      >
                  {elm.label}
                </div>
                    ))}
              </div>
            </div>
              </div>
              
                  }


          <div className="tabs__content pt-30 js-tabs-content">
            <div className="tabs__pane -tab-item-1 is-tab-el-active">
              {chart("preserveEnd")}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div >
  );
}
