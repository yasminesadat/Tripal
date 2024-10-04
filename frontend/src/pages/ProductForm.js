import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { createProduct } from "../api/ProductService";
import axios from "axios";

const ProductForm = ({ onProductCreated }) => {
  const [product, setProduct] = useState({
    name: "",
    sellerID: "",
    price: "",
    description: "",
    quantity: "",
    picture: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async () => {
  try{
    await createProduct(product); 
    message.success("Product created successfully!")
  }
  catch (error) {
    message.error("Error creating product", error);
  }};

  
  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Name" required>
        <Input
          name="name"
          value={product.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
        />
      </Form.Item>

      <Form.Item label="Seller ID" required>
        <Input
          name="sellerID"
          value={product.sellerID}
          onChange={handleInputChange}
          placeholder="Enter seller ID"
        />
      </Form.Item>

      <Form.Item label="Price" required>
        <Input
          name="price"
          type="number"
          value={product.price}
          onChange={handleInputChange}
          placeholder="Enter price"
        />
      </Form.Item>

      <Form.Item label="Description" required>
        <Input
          name="description"
          value={product.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
        />
      </Form.Item>

      <Form.Item label="Quantity" required>
        <Input
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleInputChange}
          placeholder="Enter quantity"
        />
      </Form.Item>

      <Form.Item label="Picture URL" required>
        <Input
          name="picture"
          value={product.picture}
          onChange={handleInputChange}
          placeholder="Enter picture URL"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
