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
import { getRevenue } from "@/api/ItineraryService"; 

export default function ItineraryRevenue() {
  const [revenueData, setRevenueData] = useState([]); 
 
  const [totalRevenue, setTotalRevenue] = useState(null);

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
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenue();
  },[]);

  const chart = (interval) => (
    <ResponsiveContainer height={500} width="100%">
      <LineChart data={revenueData}>
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
          <div className="text-18 fw-500">Weekly Revenue Statistics</div>
          <h3>Total Revenue: {totalRevenue}</h3>
          <div className="pt-30">{chart("preserveEnd")}</div>
        </div>
      </div>
    </div>
  );
}
