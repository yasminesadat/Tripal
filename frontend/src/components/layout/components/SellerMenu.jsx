import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link to="/destinations">Home</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/destinations">View All Products</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/destinations">Create Product</Link>
          </div>
        </div>
      </div>
    </>
  );
}
