import { getUsersPerMonth } from "@/api/AdminService";
import { StatictiesAdminUsers } from "@/data/dashboard";
import { useState , useEffect} from "react";
import {
  LineChart,
  Tooltip,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function UserStatistics({totalUsers}) {
  const [activeTab, setActiveTab] = useState(StatictiesAdminUsers[0]);
  const [setCountData] = useState([]); 

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const count = await getUsersPerMonth(2024);

        const formattedData = [
                { name: "Jan", value: count[0] },
                { name: "Feb", value: count[1] },
                { name: "Marc", value: count[2] },
                { name: "April", value: count[3] },
                { name: "May", value: count[4] },
                { name: "Jun", value: count[5] },
                { name: "July", value: count[6] },
                { name: "Agust", value: count[7] },
                { name: "Sept", value: count[8] },
                { name: "Oct", value: count[9] },
                { name: "Now", value: count[10] },
                { name: "Dec", value: count[11] },
          ];
       
        setCountData(formattedData);
        StatictiesAdminUsers[0].data=formattedData;
        StatictiesAdminUsers[1].data[5].value=totalUsers;
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchMonths();
  },[totalUsers]);


  const chart = (interval) => (
    <ResponsiveContainer height={500} width="100%">
      <LineChart data={activeTab.data}>
        <CartesianGrid strokeDasharray="" />
        <XAxis tick={{ fontSize: 12 }} dataKey="name" interval={interval} />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={[0, 20]}
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
              <div className="text-18 fw-500">New Users</div>

              <div className="tabs__controls row x-gap-20 y-gap-10 lg:x-gap-20 js-tabs-controls">
                {StatictiesAdminUsers.map((elm, i) => (
                  <div
                    onClick={() => setActiveTab(elm)}
                    key={i}
                    className="col-auto"
                  >
                    <button
                      className={`tabs__button fw-500 px-5 pb-5 lg:pb-0 js-tabs-button ${
                        activeTab.label == elm.label ? "is-tab-el-active" : ""
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
                {chart("preserveEnd")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
