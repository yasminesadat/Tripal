import { useState } from "react";
import { Form, Input, Button, message, Upload, InputNumber } from "antd";
import { createProduct } from "../../api/ProductService";
import { sellerId } from "../../IDs";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const ProductForm = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    sellerID: sellerId,
    price: "",
    description: "",
    quantity: "",
    picture: null,
  });

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
    }
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setProduct({ ...product, picture: info.file.originFileObj });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("sellerID", product.sellerID);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("quantity", product.quantity);
    formData.append("picture", product.picture);

    try {
      await createProduct(formData);
      message.success("Product created successfully!");
      navigate("/view-products");
    } catch (error) {
      message.error("Error creating product", error);
    }
  };

  return (
    <div
      style={{
        width: "50%",
        marginTop: "5%",
        marginBottom: "5%",
        marginLeft: "25%",
        backgroundColor: "lightblue",
        padding: "20px",
        borderRadius: "5px",
        textAlign: "left",
      }}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please enter the product price" },
          ]}
        >
          <InputNumber
            type="number"
            name="price"
            min={0}
            value={product.price}
            onChange={(value) => handleInputChange}
            placeholder="Enter price"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter the product description" },
          ]}
        >
          <Input
            type="text"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
          />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            { required: true, message: "Please enter the product quantity" },
          ]}
        >
          <InputNumber
            type="number"
            name="quantity"
            min={0}
            value={product.quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Picture"
          name="picture"
          rules={[
            { required: true, message: "Please upload a product picture" },
          ]}
        >
          <Upload
            name="picture"
            listType="picture"
            accept=".png,.jpeg,.jpg"
            beforeUpload={(file) => {
              const isValidType =
                file.type === "image/png" ||
                file.type === "image/jpeg" ||
                file.type === "image/jpg";
              if (!isValidType) {
                message.error("You can only upload PNG, JPEG, or JPG files!");
              }
              return isValidType ? true : Upload.LIST_IGNORE;
            }}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Upload Picture</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;
