//form
import { useState } from "react";
import { Form, Input, Button, message, Upload, InputNumber } from "antd";
import { createProduct, editProduct } from "../../api/ProductService";
import { sellerId } from "../../IDs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import "./product.css";

const ProductForm = () => {
  const { id } = useParams();
  const isCreate = id === undefined;

  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: null,
    sellerID: sellerId,
    price: null,
    description: null,
    quantity: null,
    picture: null,
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

  const handleImageChange = (info) => {
    if (info.fileList.length === 0) {
      setProduct({ ...product, picture: null });
      return;
    }

    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProduct({ ...product, picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeforeUpload = (file) => {
    if (product.picture) {
      message.error("Only one picture can be uploaded.");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProduct({ ...product, picture: reader.result });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = () => {
    setProduct({ ...product, picture: null });
  };

  const handleSubmit = async () => {
    try {
      if (isCreate) {
        const productData = {
          name: product.name,
          sellerID: product.sellerID,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          picture: product.picture, // Picture is now a Base64 string
        };
        await createProduct(productData);
        message.success("Product created successfully");
      } else {
        if (
          !product.name &&
          !product.price &&
          !product.description &&
          !product.quantity &&
          !product.picture
        ) {
          message.error(
            "At least one field must be filled to update the product."
          );
          return;
        }
        const picture = useLocation.state;
        let productData = {};
        if (product.name) productData.name = product.name;
        if (product.price) productData.price = product.price;
        if (product.description) productData.description = product.description;
        if (product.quantity) productData.quantity = product.quantity;
        if (product.picture) {
          productData.picture = product.picture;
          productData.initalPicture = picture;
        }
        await editProduct(id, productData);
        message.success("Product updated successfully");
      }
      navigate("/view-products");
    } catch (error) {
      message.error(
        `${
          isCreate ? "Error creating product: " : "Error updating product: "
        }` + error.message
      );
    }
  };

  return (
    <div className="product-form-container">
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: isCreate, message: "Please enter the product name" },
          ]}
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
            { required: isCreate, message: "Please enter the product price" },
          ]}
        >
          <InputNumber
            name="price"
            min={0}
            value={product.price}
            onChange={(value) => handleNumberChange("price", value)}
            placeholder="Enter price"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: isCreate,
              message: "Please input the product description!",
            },
          ]}
        >
          <Input.TextArea
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
            {
              required: isCreate,
              message: "Please enter the product quantity",
            },
          ]}
        >
          <InputNumber
            name="quantity"
            min={0}
            value={product.quantity}
            onChange={(value) => handleNumberChange("quantity", value)}
            placeholder="Enter quantity"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Picture"
          name="picture"
          rules={[
            { required: isCreate, message: "Please upload a product picture" },
          ]}
        >
          <Upload
            name="picture"
            listType="picture"
            accept=".png,.jpeg,.jpg"
            beforeUpload={handleBeforeUpload} // Prevent multiple uploads
            onChange={handleImageChange}
            onRemove={handleRemove} // Allow removal of the picture
            fileList={
              product.picture
                ? [
                    {
                      uid: "-1",
                      name: "image.png",
                      status: "done",
                      url: product.picture,
                    },
                  ]
                : []
            } // Ensure only one file is shown
          >
            {!product.picture && (
              <Button icon={<UploadOutlined />}>Upload Picture</Button>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {isCreate ? "Create Product" : "Update Product"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;
