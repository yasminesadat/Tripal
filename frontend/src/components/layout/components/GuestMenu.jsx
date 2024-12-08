import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="xl:d-none ">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link to="/">Home</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/upcomingactivities">Activities</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/upcomingitineraries">Itineraries</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/historicalPlaces">Historical Places</Link>
          </div>
        </div>
      </div>
    </>
  );
}