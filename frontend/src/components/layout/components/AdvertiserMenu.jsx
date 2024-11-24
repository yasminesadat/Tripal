import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link to="/advertiser">Home</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/advertiser/activities">Activities</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/create-activity">Create Activity</Link>
          </div>
        </div>
      </div>
    </>
  );
}

