
import { useState, useEffect,useRef } from "react";
import {
  LineChart,
  Tooltip,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function ActivityBooking({ bookings, price }) {
  const [tabs, setTabs] = useState([{ label: "Revenue", data: [] }, { label: "Bookings", data: [] }]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [revenue, setRevenue] = useState([]);
  const [tickets, setTickets] = useState([]);
  const sortOptions = [
    { label: "Monthly", order: "month" },
    { label: "Daily", order: "date" },
  ];
  const [ddActive1, setDdActives1] = useState(false);
  const [ddActives2, setDdActives2] = useState(false);
  const [filterRevenueOption, setFilterRevenueOption] = useState("");
  const [filterTicketsOption, setFilterTicketsOption] = useState("");
  
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer1.current &&
        !dropDownContainer1.current.contains(event.target)
      ) {
        setDdActives1(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer2.current &&
        !dropDownContainer2.current.contains(event.target)
      ) {
        setDdActives2(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  const dropDownContainer1 = useRef();
  const dropDownContainer2 = useRef();
 
  const generateRandomPastDate = (start, end) => {
    const startDate = new Date(start.getTime());
    const randomDate = new Date(startDate.getTime() + Math.random() * (end.getTime() - startDate.getTime()));
    return randomDate.toLocaleDateString("en-CA");
  };
  const getValue = (monthStr) => {
    const monthMap = {
      "01": 1, "02": 2, "03": 3, "04": 4, "05": 5,
      "06": 6, "07": 7, "08": 8, "09": 9, "10": 10,
      "11": 11, "12": 12,"13":13,"14":14,"15":15,"16":16,"17":17,
      "18":18,"19":19,"20":20,"21":21 ,"22":22,"23":23,"24":24,"25":25,
      "26":26,"27":27,"28":28,"29":29,"30":30,"31":31,
    };
    return monthMap[monthStr] || 0;
  };

  useEffect(() => {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); 
    const endDate = new Date();
    let updatedBookings = bookings.map((booking) => ({
      name: generateRandomPastDate(startDate, endDate),
      value: booking.tickets,
    })).sort((a, b) =>(
      (getValue(a.name.split("-")[0].substring(2, 4)) - getValue(b.name.split("-")[0].substring(2, 4)))===0?
      (getValue(a.name.split("-")[1]) - getValue(b.name.split("-")[1]))===0?
      (getValue(a.name.split("-")[2]) - getValue(b.name.split("-")[2])):
      (getValue(a.name.split("-")[1]) - getValue(b.name.split("-")[1])):
      (getValue(a.name.split("-")[0].substring(2, 4)) - getValue(b.name.split("-")[0].substring(2, 4)))
    ));
    let bookingsTickets = updatedBookings.map((booking) => ({
      fullDate: booking.name,
      monthDate: new Date(booking.name).toLocaleString('default', { month: 'long' }),
      value: booking.value,
    })).sort((a, b) =>(
      (getValue(a.fullDate.split("-")[0].substring(2, 4)) - getValue(b.fullDate.split("-")[0].substring(2, 4)))===0?
      (getValue(a.fullDate.split("-")[1]) - getValue(b.fullDate.split("-")[1]))===0?
      (getValue(a.fullDate.split("-")[2]) - getValue(b.fullDate.split("-")[2])):
      (getValue(a.fullDate.split("-")[1]) - getValue(b.fullDate.split("-")[1])):
       (getValue(a.fullDate.split("-")[0].substring(2, 4)) - getValue(b.fullDate.split("-")[0].substring(2, 4)))

    ));
    let bookingRevenue = updatedBookings.map((booking) => ({
      fullDate: booking.name,
      monthDate: new Date(booking.name).toLocaleString('default', { month: 'long' }),
      value: booking.value*price- 0.1*price,
    })).sort((a, b) =>(
      (getValue(a.fullDate.split("-")[0].substring(2, 4)) - getValue(b.fullDate.split("-")[0].substring(2, 4)))===0?
      (getValue(a.fullDate.split("-")[1]) - getValue(b.fullDate.split("-")[1]))===0?
      (getValue(a.fullDate.split("-")[2]) - getValue(b.fullDate.split("-")[2])):
      (getValue(a.fullDate.split("-")[1]) - getValue(b.fullDate.split("-")[1])):
      (getValue(a.fullDate.split("-")[0].substring(2, 4)) - getValue(b.fullDate.split("-")[0].substring(2, 4)))
    ));
    setRevenue(bookingRevenue);
    setTickets(bookingsTickets)
    console.log(bookingRevenue)
    let AdvertiserRevenue = updatedBookings.map((booking) => ({
      name: booking.name,
      value: booking.value * price- 0.1*price,
    })).sort((a, b) =>(
      (getValue(a.name.split("-")[0].substring(2, 4)) - getValue(b.name.split("-")[0].substring(2, 4)))===0?
      (getValue(a.name.split("-")[1]) - getValue(b.name.split("-")[1]))===0?
      (getValue(a.name.split("-")[2]) - getValue(b.name.split("-")[2])):(getValue(a.name.split("-")[1]) - getValue(b.name.split("-")[1])):(getValue(a.name.split("-")[0].substring(2, 4)) - getValue(b.name.split("-")[0].substring(2, 4)))
    ));
    setTabs([
      { label: "Revenue", data: [...AdvertiserRevenue] }, // Clone array to prevent mutation issues
      { label: "Bookings", data: [...updatedBookings] },
    ]);
  }, []);
  useEffect(() => {
    setTabs((prevTabs) => 
      prevTabs.map((tab) =>
        tab.label === "Revenue"
          ? {
              ...tab,
              data: filterRevenueOption.order === "month"
                ? Object.entries(
                    revenue.reduce((acc, booking) => {
                      // Group by month
                      const monthDate = booking.monthDate; // Assuming `monthDate` is already extracted as "YYYY-MM"
                      acc[monthDate] = (acc[monthDate] || 0) + booking.value; // Sum the revenue
                      return acc;
                    }, {})
                  ).map(([name, value]) => ({ name, value })) // Convert the grouped object to an array
                : revenue.map((booking) => ({
                    name: booking.fullDate,
                    value: booking.value,
                  })), // Keep original structure for "fullDate"
            }
          : tab
      )
    );
    
  
  }, [revenue, filterRevenueOption]);
  useEffect(() => {
    setTabs((prevTabs) => 
      prevTabs.map((tab) =>
        tab.label === "Bookings"
          ? {
              ...tab,
              data: filterTicketsOption.order === "month"
                ? Object.entries(
                    tickets.reduce((acc, booking) => {
                      // Group by month
                      const monthDate = booking.monthDate; // Assuming monthDate is already extracted as "YYYY-MM"
                      acc[monthDate] = (acc[monthDate] || 0) + booking.value; // Sum the tickets
                      return acc;
                    }, {})
                  ).map(([name, value]) => ({ name, value })) // Convert the grouped object to an array
                : tickets.map((booking) => ({
                    name: booking.fullDate,
                    value: booking.value,
                  })), // Keep original structure for "fullDate"
            }
          : tab
      )
    );
    
  }, [tickets, filterTicketsOption]);
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
    <>
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
              {activeTab.label === "Revenue" && <div ref={dropDownContainer1} className="col-auto" >
              <div
                className={`dropdown -type-2 js-dropdown js-form-dd ${ddActive1 ? "is-active" : ""
                  } `}
                data-main-value=""
              >
                <div
                  className="dropdown__button js-button"
                  onClick={() => setDdActives1((pre) => !pre)}
                >
                  <span>View Revenue</span>
                  <span className="js-title">
                    {filterRevenueOption.label ? filterRevenueOption.label : ""}
                  </span>
                  <i className="icon-chevron-down"></i>
                </div>

                <div className="dropdown__menu js-menu-items">
                  {sortOptions.map((elm, i) => (
                    <div
                      onClick={() => {
                        setFilterRevenueOption(elm);
                        setDdActives1(false);
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
                    {activeTab.label === "Bookings" && <div ref={dropDownContainer2} className="col-auto" >
              <div
                className={`dropdown -type-2 js-dropdown js-form-dd ${ddActives2 ? "is-active" : ""
                  } `}
                data-main-value=""
              >
                <div
                  className="dropdown__button js-button"
                  onClick={() => setDdActives2((pre) => !pre)}
                >
                  <span>View Tickets</span>
                  <span className="js-title">
                    {filterTicketsOption.label ? filterTicketsOption.label : ""}
                  </span>
                  <i className="icon-chevron-down"></i>
                </div>

                <div className="dropdown__menu js-menu-items">
                  {sortOptions.map((elm, i) => (
                    <div
                      onClick={() => {
                        setFilterTicketsOption(elm);
                        setDdActives2(false);
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
      </div>

    </>
  );

}
