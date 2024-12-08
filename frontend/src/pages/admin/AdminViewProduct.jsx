import ProductDetails from "../../components/product/ProductDetails";

const AdminViewProduct = () => {
  return (
    <div>
      <ProductDetails homeURL={"/admin"} productsURL={"/admin/view-products"}/>
      <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>    </div>
  );
};

export default AdminViewProduct;