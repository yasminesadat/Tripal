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

const extractPrice = (priceString) => {
  const numericValue = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  return numericValue;
};

export default function ProductRevenue({ productSales, price }) {
  const [tabs, setTabs] = useState([
    { label: "Revenue", data: [] },
    { label: "Product Sales", data: [] },
  ]);

  const priceNoCurrency = price ? extractPrice(price) : 0;
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [revenue, setRevenue] = useState([]);
  const [sortOption, setSortOption] = useState("monthly");
  const sortOptions = [
    { label: "Monthly", order: "month" },
    { label: "Daily", order: "date" },
  ];
  const [ddActives, setDdActives] = useState(false);

  const dropDownContainer = useRef();

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

  useEffect(() => {
    if (productSales && priceNoCurrency > 0) {
      const updatedSales = [
        {
          name: new Date().toISOString().split("T")[0],
          value: productSales,
        },
      ];

      const salesRevenue = updatedSales.map((sale) => ({
        fullDate: new Date(sale.name).toISOString().split("T")[0],
        monthDate: new Date(sale.name).toLocaleString("default", { month: "long" }),
        value: sale.value * priceNoCurrency,
      }));

      setRevenue(salesRevenue);
      setTabs([
        { label: "Revenue", data: salesRevenue },
        { label: "Product Sales", data: updatedSales },
      ]);
    }
  }, [productSales, priceNoCurrency]);

  useEffect(() => {
    if (revenue.length > 0) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.label === "Revenue"
            ? {
                ...tab,
                data: revenue.map((sale) => ({
                  name: sortOption === "month" ? sale.monthDate : sale.fullDate,
                  value: sale.value,
                })),
              }
            : tab
        )
      );
      setActiveTab((prevTab) =>
        prevTab.label === "Revenue" ? tabs[0] : tabs[1]
      );
    }
  }, [sortOption, revenue]);

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

            {activeTab.label === "Revenue" && (
              <div ref={dropDownContainer} className="col-auto">
                <div
                  className={`dropdown -type-2 js-dropdown js-form-dd ${ddActives ? "is-active" : ""}`}
                  data-main-value=""
                >
                  <div className="dropdown__button js-button" onClick={() => setDdActives((prev) => !prev)}>
                    <span>View Revenue</span>
                    <span className="js-title">{sortOption ? sortOption : ""}</span>
                    <i className="icon-chevron-down"></i>
                  </div>

                  <div className="dropdown__menu js-menu-items">
                    {sortOptions.map((elm, i) => (
                      <div
                        onClick={() => {
                          setSortOption(elm.order);
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
