import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Form, InputNumber, Input, Button, message } from "antd";
import { editProduct } from "../../api/ProductService";
import "./product.css";

const ProductEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { price: initialPrice, description: initialDescription } =
    location.state;

  const [product, setProduct] = useState({
    price: null,
    description: null,
  });

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
    }
  };

  const handleNumberChange = (name, value) => {
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async () => {
    const { price, description } = product;
    const validPrice = price !== null && price !== initialPrice;
    const validdescription =
      description !== null && description !== initialDescription;
    console.log(`${description} and ${initialDescription}`);
    // Check if at least one field is filled and different from the initial values
    if (validPrice || validdescription) {
      try {
        const productData = {};
        if (validPrice) {
          productData.price = price;
        }
        if (validdescription) {
          productData.description = description;
        }
        // Call the API to update the product
        await editProduct(id, productData);
        message.success("Product updated successfully!");
        navigate("/view-products");
      } catch (error) {
        message.error("Failed to update product. Please try again.");
      }
    } else {
      message.warning(
        "Please provide at least one valid value different from the initial values."
      );
    }
  };

  return (
    <div className="product-form-container">
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Price" name="price">
          <InputNumber
            name="price"
            min={0}
            value={product.price}
            onChange={(value) => handleNumberChange("price", value)}
            placeholder="Enter new price"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input
            type="text"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEdit;
