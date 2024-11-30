import  { useState } from "react";

export default function RoadMap2({timeline}) {
  const [activeRoadmap, setActiveRoadmap] = useState(0);

   const roadmapData2 = [
    {
      id: 1,
      icon: "icon-pin",
      title: "Day 1: Pick Up",
      content:
        "Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.",

    },...timeline,
    {
      id:timeline.length,
      icon: "icon-pin",
      title: `Day ${timeline.length+1} : Drop Off`,
      content:
      "On the final day of your trip, we will take you back to the airport for your departure. You'll have a chance to reflect on the memories made and the new experiences gained. Our team will ensure a smooth and comfortable transfer, and we hope to see you on another adventure soon!",
    }
]

  return (
    <div className="roadmap roadMap2">
      {roadmapData2.map((elm, i) => (
        <div key={i} className="roadmap__item">
          {elm.icon ? (
            <div
              className="roadmap__iconBig"
              onClick={() => setActiveRoadmap((pre) => (pre == i ? -1 : i))}
            >              
              <i className={elm.icon}></i>
            </div>
          ) : (
            <div
              className="roadmap__icon"
              onClick={() => setActiveRoadmap((pre) => (pre == i ? -1 : i))}
            ></div>
          )}
          <div className="roadmap__wrap">
            <div
              className="roadmap__title "
              onClick={() => setActiveRoadmap((pre) => (pre == i ? -1 : i))}
            >
            {elm.activityName || elm.title}</div>
            {elm.content && (
              <div
                className={`roadmap__content ${
                  activeRoadmap == i ? "active" : ""
                } `}
              >
                {elm.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}