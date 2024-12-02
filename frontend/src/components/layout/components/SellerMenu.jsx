import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <div className="xl:d-none ml-30">
        <div className="desktopNav">
          <div className="desktopNav__item">
            <Link to="/seller">Home</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/seller/view-products">All Products</Link>
          </div>

          <div className="desktopNav__item">
            <Link to="/seller/create-product">Post Product</Link>
          </div>
        </div>
      </div>
    </>
  );
}
