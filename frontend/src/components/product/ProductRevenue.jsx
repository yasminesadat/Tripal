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

export default function ProductRevenue({ productSales, price }) {
  const [tabs, setTabs] = useState([{ label: "Sales Revenue", data: [] }, { label: "Product Sales", data: [] }]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [revenue, setRevenue] = useState([]);
  const sortOptions = [
    { label: "Monthly", order: "month" },
    { label: "Daily", order: "date" },
  ];
  const [ddActives, setDdActives] = useState(false);
  const [sortOption, setSortOption] = useState("");
  
  const dropDownContainer = useRef();

  // Close dropdown when clicking outside
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

  // Generate a random past date for sales (for demonstration purposes)
  const generateRandomPastDate = (start, end) => {
    const startDate = new Date(start.getTime());
    const randomDate = new Date(startDate.getTime() + Math.random() * (end.getTime() - startDate.getTime()));
    return randomDate.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  };

  // Setup revenue and sales data
  useEffect(() => {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // 1 year in the past
    const endDate = new Date(); // Today

    // Generate random sales data
    let updatedSales = productSales.map((sale) => ({
      name: generateRandomPastDate(startDate, endDate),
      value: sale.quantity,
    }));

    // Revenue based on sales * price
    let salesRevenue = updatedSales.map((sale) => ({
      fullDate: generateRandomPastDate(startDate, endDate),
      monthDate: new Date(sale.name).toLocaleString('default', { month: 'long' }),
      value: sale.value * price,
    }));

    setRevenue(salesRevenue);

    // Update tabs with sales and revenue data
    setTabs([
      { label: "Sales Revenue", data: salesRevenue },
      { label: "Product Sales", data: updatedSales },
    ]);
  }, [productSales, price]);

  // Update revenue chart when sorting option changes
  useEffect(() => {
    setTabs((prevTabs) => (
      prevTabs.map((tab) =>
        tab.label === "Sales Revenue"
          ? {
              ...tab,
              data: revenue.map((sale) => ({
                name: sortOption.order === "month" ? sale.monthDate : sale.fullDate,
                value: sale.value,
              })),
            }
          : tab
      )
    ));
    setActiveTab((prevTab) => (prevTab.label === "Sales Revenue" ? tabs[0] : tabs[1]));
  }, [sortOption]);

  // Chart rendering logic
  const chart = (interval) => (
    <ResponsiveContainer height={500} width="100%">
      <LineChart data={activeTab.data}>
        <CartesianGrid strokeDasharray="" />
        <XAxis tick={{ fontSize: 12 }} dataKey="name" interval={interval} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 300]} tickCount={7} interval={interval} />
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
              <div className="text-18 fw-500">Sales Statistics</div>
              <div className="tabs__controls row x-gap-20 y-gap-10 lg:x-gap-20 js-tabs-controls">
                {tabs.map((elm, i) => (
                  <div onClick={() => setActiveTab(elm)} key={i} className="col-auto">
                    <button
                      className={`tabs__button fw-500 px-5 pb-5 lg:pb-0 js-tabs-button ${activeTab.label === elm.label ? "is-tab-el-active" : ""}`}
                    >
                      {elm.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {activeTab.label === "Sales Revenue" && (
              <div ref={dropDownContainer} className="col-auto">
                <div className={`dropdown -type-2 js-dropdown js-form-dd ${ddActives ? "is-active" : ""}`} data-main-value="">
                  <div className="dropdown__button js-button" onClick={() => setDdActives((prev) => !prev)}>
                    <span>View Revenue</span>
                    <span className="js-title">{sortOption.label ? sortOption.label : ""}</span>
                    <i className="icon-chevron-down"></i>
                  </div>

                  <div className="dropdown__menu js-menu-items">
                    {sortOptions.map((elm, i) => (
                      <div
                        onClick={() => {
                          setSortOption(elm);
                          setDdActives(false);
                        }}
                        key={i}
                        className="dropdown__item"
                      >
                        {elm.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="tabs__content pt-30 js-tabs-content">
              <div className="tabs__pane -tab-item-1 is-tab-el-active">
                {chart("preserveEnd")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
