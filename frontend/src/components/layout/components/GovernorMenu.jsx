import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link to="/governor">Home</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/destinations">Historical Places</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/add-historical-place">Add Historical Place</Link>
          </div>
        </div>
      </div>
    </>
  );
}
