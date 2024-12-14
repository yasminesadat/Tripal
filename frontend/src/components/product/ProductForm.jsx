import { useState } from "react";
import { Form, Input, Button, message, Upload, InputNumber } from "antd";
import { createProduct, editProduct } from "../../api/ProductService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MetaComponent from "../common/MetaComponent";

const metadata = {
  title: "Products || Tripal",
};

const ProductForm = () => {
  const { id } = useParams();
  const isCreate = id === undefined;

  const navigate = useNavigate();
  const location = useLocation();

  const {
    initialName,
    initialPrice,
    initialDescription,
    initialQuantity,
    initialPicture,
    userId,
  } = location.state || {};

  const [product, setProduct] = useState({
    name: null,
    sellerID: userId,
    price: null,
    description: null,
    quantity: null,
    picture: isCreate ? null : initialPicture,
  });

  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState(
    isCreate ? "Create Product" : "Update Product"
  );

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please check the form and try again.");
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
    setLoading(true);
    try {
      if (isCreate) {
        setButtonText("Submitting...");
        const productData = {
          name: product.name,
          sellerID: product.sellerID,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          picture: product.picture,
        };
        await createProduct(productData);
        message.success("Product created successfully");
        setButtonText("Success!");
      } else {
        if (
          !product.name &&
          !product.price &&
          !product.description &&
          !product.quantity &&
          product.picture === initialPicture
        ) {
          message.warning(
            "At least one field must be edited to update the product."
          );
          return;
        }
        if (!product.picture) {
          message.warning("Please upload a picture.");
          return;
        }
        setButtonText("Submitting...");
        let productData = {};
        if (product.name) productData.name = product.name;
        if (product.price) productData.price = product.price;
        if (product.description) productData.description = product.description;
        if (product.quantity) productData.quantity = product.quantity;
        if (product.picture !== initialPicture) {
          productData.picture = product.picture;
          productData.initialPicture = initialPicture;
        }
        await editProduct(id, productData);
        message.success("Product updated successfully");
        setButtonText("Success!");
      }
      setTimeout(() => navigate("/seller/view-products"), 1000);
    } catch (error) {
      message.error(
        `${isCreate ? "Error creating product: " : "Error updating product: "
        } Please try again later.`
      );
      setButtonText("Failed");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setButtonText(isCreate ? "Create Product" : "Update Product");
      }, 1000);
    }
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="product-form-container">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="picture"
            rules={[
              {
                required: isCreate,
                message: "Please upload a product picture",
              },
            ]}
          >
            <div className="col-12">
              <Upload
                name="logo"
                listType="picture"
                accept=".png,.jpeg,.jpg"
                beforeUpload={handleBeforeUpload}
                onChange={handleImageChange}
                onRemove={handleRemove}
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
                }
              >
                {product.picture ? (
                  <div className="uploaded-image-container">
                    <img
                      alt="uploaded logo"
                      src={product.picture}
                      className="size-200 rounded-12 bg-light-purple1 flex-center flex-column"
                    />
                  </div>
                ) : (
                  <div className="col-auto">
                    <label
                      htmlFor="imageInp2"
                      className="size-200 rounded-12 border-dash-2 bg-light-purple1 flex-center flex-column"
                    >
                      <img alt="image" src={"/img/dashboard/upload.svg"} />
                      <div className="text-16 fw-500 dark-purple mt-10">
                        Upload Product Image
                      </div>
                    </label>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>
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
              defaultValue={initialName}
              value={product.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              style={{
                padding: "8px",
                borderColor: "var(--color-light-purple)",
                boxShadow: "0 0 0 2px rgba(128, 0, 128, 0.2)",
              }}
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
              defaultValue={initialPrice}
              value={product.price}
              onChange={(value) => handleNumberChange("price", value)}
              placeholder="Enter price"
              style={{
                width: "100%",
                padding: "8px",
                borderColor: "var(--color-light-purple)",
                boxShadow: "0 0 0 2px rgba(128, 0, 128, 0.2)",
              }}
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
              defaultValue={initialDescription}
              value={product.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              style={{
                padding: "8px",
                borderColor: "var(--color-light-purple)",
                boxShadow: "0 0 0 2px rgba(128, 0, 128, 0.2)",
              }}
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
              defaultValue={initialQuantity}
              value={product.quantity}
              onChange={(value) => handleNumberChange("quantity", value)}
              placeholder="Enter quantity"
              style={{
                width: "100%",
                padding: "8px",
                borderColor: "var(--color-light-purple)",
                boxShadow: "0 0 0 2px rgba(128, 0, 128, 0.2)",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "var(--color-stone)",
                borderColor: "var(--color-stone)",
              }}
              loading={loading}
              className="submit-button"
            >
              {buttonText}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <style>
        {`
    .product-form-container {
      padding-left: 15% !important;
      padding-right: 15% !important;
    }

    .submit-button {
      background-color: var(--color-stone) !important;
    }

    .submit-button:hover,
    .submit-button:focus {
      background-color: var(--color-stone-light) !important;
    }
     
    .ant-input,
    .ant-input-number,
    .ant-input-affix-wrapper,
    .ant-input-password {
      padding: 8px !important; 
      border-color: var(--color-light-purple) !important;
      box-shadow: 0 0 0 2px rgba(128, 0, 128, 0.2) !important;
    }

    .ant-input:focus,
    .ant-input-focused,
    .ant-input:hover,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused,
    .ant-input-affix-wrapper:hover,
    .ant-input-number:hover,
    .ant-input-number:focus,
    .ant-input-number-focused:hover,
    .ant-input-number .ant-input:focus,
    .ant-input-number .ant-input-focused,
    .ant-input-number .ant-input:hover,
    .ant-input-number .ant-input:focus,
    .ant-input-number .ant-input-focused:hover,
    .ant-input-number .ant-input:active,
    .ant-input-number .ant-input:visited,
    .ant-input-number-focused,
    .ant-input-number:focus-within {
      border-color: var(--color-light-purple) !important;
      box-shadow: 0 0 0 2px rgba(128, 0, 128, 0.2) !important;
    }

     /* Override Ant Design arrow colors to dark purple */
    .ant-select-arrow,
    .ant-picker-arrow,
    .ant-input-number-handler-up-inner,
    .ant-input-number-handler-down-inner {
      color: var(--color-dark-purple) !important;
    }
  `}
      </style>
    </>
  );
};

export default ProductForm;