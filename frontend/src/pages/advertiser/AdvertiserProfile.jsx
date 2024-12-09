//import Sidebar from "./Sidebar";
import Header from "../../components/dasboard/Header";
import Map from "../../components/pages/contact/Map";
import React, { useEffect, useState } from "react";
import {
  getAdvertiser,
  createAdvertiser,
  updateAdvertiser,
} from "../../api/AdvertiserService";
import { useParams, useNavigate } from "react-router-dom";
//import AdvertiserNavBar from "../../components/navbar/AdvertiserNavBar";
//import ChangePassword from "../../components/common/ChangePassword";
import { requestAccountDeletion } from "../../api/RequestService";
import { Button, message, Upload } from "antd";
import AdvertiserHeader from "../../components/layout/header/AdvertiserHeader";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { changeAdvertiserPassword } from "../../api/AdvertiserService";
import FooterThree from "@/components/layout/footers/FooterThree";

const tabs = ["General", "Location", "Contact"];
export default function AdvertiserProfile() {
  //const [sideBarOpen, setSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("General");
  //   const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("/img/dashboard/addtour/1.jpg");
  //   const [image3, setImage3] = useState("/img/dashboard/addtour/2.jpg");
  //   const [image4, setImage4] = useState("/img/dashboard/addtour/3.jpg");
  const [advertiser, setAdvertiser] = useState(null);
  const [formData, setFormData] = useState({ currentLogo: null });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const [PasswordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangePassword = async () => {
    try {
      if (PasswordForm.newPassword.length < 6) {
        message.error("Password must be at least 6 characters long");
        return;
      }
      if (PasswordForm.newPassword !== PasswordForm.confirmPassword) {
        message.error("Passwords don't match");
        return;
      }


      await changeAdvertiserPassword(PasswordForm.oldPassword, PasswordForm.newPassword);
      message.success("Password changed successfully");


    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to change password"
      );
      console.error("Password change error:", error);
    }
  };
  //   const handleImageChange = (event, func) => {
  //     const file = event.target.files[0];

  //     if (file) {
  //       const reader = new FileReader();

  //       reader.onloadend = () => {
  //         func(reader.result);
  //       };

  //       reader.readAsDataURL(file);
  //     }
  //   };

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const data = await getAdvertiser(); // Make the API call
        console.log(data);
        console.log("im in use effect");
        setAdvertiser(data);
        setFormData({
          ...data,
          existingImage: data?.companyProfile?.logo || null,
          currentLogo: data?.companyProfile?.logo || null,
        });
      } catch (error) {
        console.error("Error fetching advertiser:", error); // This should log if there's an error
      }
    };

    fetchAdvertiser();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (name === "companyProfile.employees") {
      // Convert value to number
      const numberValue = Number(value);

      // Check if the value is a valid number
      if (isNaN(numberValue) || numberValue < 0) {
        message.error("Please enter a valid number for Employees.");
        return;
      }
    }
    if (name === "companyProfile.foundedYear") {
      const numberValue = Number(value);
      const currentYear = new Date().getFullYear();

      if (isNaN(numberValue)) {
        message.error("Please enter a valid year.");
        return;
      }
    }

    setFormData((prevData) => {
      let updatedData = { ...prevData };

      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = value;
        } else {
          acc[key] = { ...acc[key] };
        }
        return acc[key];
      }, updatedData);

      console.log(formData);
      return updatedData;
    });
  };

  // Handle dynamic input changes for certifications and awards
  const handleItemChange = (e, index, field, type) => {
    const { value } = e.target;

    setFormData((prevData) => {
      const updatedItems = [...prevData.companyProfile[type]];

      if (type === "certifications") {
        // Directly update the certification value
        updatedItems[index] = value || "";
      } else if (type === "awards") {
        // Update the specific field for awards (e.g., title, year, issuer)
        updatedItems[index] = {
          ...updatedItems[index], // Preserve the other fields
          [field]: value || "", // Update the specific field (title, issuer, etc.)
        };
      }

      return {
        ...prevData,
        companyProfile: {
          ...prevData.companyProfile,
          [type]: updatedItems, // Update the certifications or awards
        },
      };
    });
  };

  // Handle adding a new certification or award
  const handleAddCertificate = () => {
    setFormData((prevAdvertiser) => {
      const updatedCertificates = [
        ...prevAdvertiser.companyProfile.certifications,
        "", // Add an empty string for the new certificate
      ];

      return {
        ...prevAdvertiser,
        companyProfile: {
          ...prevAdvertiser.companyProfile,
          certifications: updatedCertificates,
        },
      };
    });
  };

  const handleAddAward = () => {
    setFormData((prevAdvertiser) => {
      const updatedAwards = [
        ...prevAdvertiser.companyProfile.awards,
        { title: "", issuer: "", year: "" }, // Add an empty award object
      ];

      return {
        ...prevAdvertiser,
        companyProfile: {
          ...prevAdvertiser.companyProfile,
          awards: updatedAwards,
        },
      };
    });
  };

  // Handle removing a certification or award
  const handleRemoveItem = (index, type) => {
    setFormData((prevData) => {
      const items = prevData.companyProfile[type] || [];

      // Only proceed if it's a valid array
      const updatedItems = Array.isArray(items)
        ? items.filter((_, i) => i !== index)
        : [];
      return {
        ...prevData,
        companyProfile: {
          ...prevData.companyProfile,
          [type]: updatedItems,
        },
      };
    });
  };

  const handleLogoChange = (info) => {
    if (info.fileList.length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        currentLogo: null,
      }));
      return;
    }

    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          currentLogo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeforeUpload = (file) => {
    if (formData.currentLogo) {
      message.error("Only one logo can be uploaded.");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prevData) => ({
        ...prevData,
        currentLogo: reader.result,
      }));
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = () => {
    setFormData((prevData) => ({
      ...prevData,
      currentLogo: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call API to update the advertiser
      const advertiserData = { ...formData };

      // Only include the logo if it has been changed
      if (formData.currentLogo === formData.existingImage) {
        advertiserData.currentLogo = null;
        advertiserData.existingImage = null;
      }
      console.log(advertiserData);
      await updateAdvertiser(advertiserData);

      message.success("Profile updated successfully!");
    } catch (err) {
      message.error(err.response.data.error);
    }
  };

  const handleDeletion = async () => {
    try {
      const response = await requestAccountDeletion();
      message.success(response.message);
      navigate("/login");
    } catch (error) {
      message.warning(error.response?.data?.message || "An error occurred.");
    }
  };
  //   console.log(advertiser)
  const General = advertiser
    ? [
      {
        label: "Company Name",
        value: advertiser.companyProfile?.companyName || "",
      },
      { label: "Industry", value: advertiser.companyProfile?.industry || "" },
      {
        label: "Description",
        value: advertiser.companyProfile?.description || "",
      },
      {
        label: "Founded Year",
        value: advertiser.companyProfile?.foundedYear || "",
      },
      {
        label: "Employees",
        value: advertiser.companyProfile?.employees || "",
      },
      {
        label: "Certifications",
        value: formData.companyProfile?.certifications?.join(", ") || [],
      },
    ]
    : [];

  const Contact = advertiser
    ? [
      { label: "Email", value: advertiser.email || "" },
      { label: "Website", value: advertiser.website || "", isLink: true },
      {
        label: "LinkedIn",
        value: advertiser.companyProfile?.socialMedia?.linkedin || "",
        isLink: true,
      },
      {
        label: "Twitter",
        value: advertiser.companyProfile?.socialMedia?.twitter || "",
        isLink: true,
      },
    ]
    : [];

  const Location = advertiser
    ? [
      {
        label: "Address",
        value: advertiser.companyProfile?.headquarters?.address || "",
      },
      {
        label: "City",
        value: advertiser.companyProfile?.headquarters?.city || "",
      },
      {
        label: "Country",
        value: advertiser.companyProfile?.headquarters?.country || "",
      },
    ]
    : [];

  return (
    <>
      <div>
        <AdvertiserHeader />
        <style>
          {`
           .password-toggle {
                              position: absolute;
                              right: 10px;
                              top: 50%;
                              transform: translateY(-50%);
                              background: none;
                              border: none;
                              cursor: pointer;
                              color: var(--color-stone);
                              z-index: 2;
                              padding: 5px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                            }
                            .password-toggle:hover {
                              color: var(--color-stone-light);
                            }
          .contactForm .form-input {
            position: relative;
            margin-bottom: 20px;
          }
          .contactForm .form-input label {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: 0.3s ease;
            color: #aaa;
          }
          .contactForm .form-input input:focus + label,
          .contactForm .form-input textarea:focus + label,
          .contactForm .form-input input:not(:placeholder-shown) + label,
          .contactForm .form-input textarea:not(:placeholder-shown) + label,
          .contactForm .form-input input.filled + label,
          .contactForm .form-input textarea.filled + label {
            transform: translateY(-29px);
            font-size: 12px;
            color: #333;
          }
          .contactForm .form-input input,
          .contactForm .form-input textarea {
            padding: 10px;
            font-size: 16px;
            width: 100%;
            border: 1px solid #ccc;
            outline: none;
          }
        `}
        </style>

        <div className="dashboard__content" style={{ marginTop: "70px" }}>
          <div className="dashboard__content_content">
            <div className="d-flex justify-between items-center mb-20">
              <h1 className="text-30">Profile</h1>
              <button
                className="button -md -dark-1 delete-btn"
                onClick={handleDeletion}
              >
                Delete Account
                <i className="icon-delete text-20 ml-10"></i>
              </button>
            </div>
            <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-60">
              <div className="tabs -underline-2 js-tabs">
                <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
                  {tabs.map((elm, i) => (
                    <div
                      onClick={() => setActiveTab(elm)}
                      key={i}
                      className="col-auto"
                    >
                      <button
                        className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${activeTab == elm ? "is-tab-el-active" : ""
                          }`}
                      >
                        {i + 1}. {elm}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="row pt-40">
                  <div className="col-xl-9 col-lg-10">
                    <div className="tabs__content js-tabs-content">
                      <div
                        className={`tabs__pane  ${activeTab == "General" ? "is-tab-el-active" : ""
                          }`}
                      >
                        <div className="contactForm row y-gap-30">
                          {/* logo */}

                          <div className="col-12">
                            <Upload
                              name="logo"
                              listType="picture"
                              accept=".png,.jpeg,.jpg"
                              beforeUpload={handleBeforeUpload} // Prevent multiple uploads
                              onChange={handleLogoChange}
                              onRemove={handleRemove} // Allow removal of the logo
                              fileList={
                                formData.currentLogo
                                  ? [
                                    {
                                      uid: "-1",
                                      name: "logo.png",
                                      status: "done",
                                      url: formData.currentLogo,
                                    },
                                  ]
                                  : []
                              } // Ensure only one file is shown
                            >
                              {formData.currentLogo ? (
                                <div className="uploaded-image-container">
                                  <img
                                    alt="uploaded logo"
                                    src={formData.currentLogo}
                                    className="size-200 rounded-12 bg-light-purple1 flex-center flex-column"
                                  />
                                </div>
                              ) : (
                                <div className="col-auto">
                                  <label
                                    htmlFor="imageInp2"
                                    className="size-200 rounded-12 border-dash-2 bg-light-purple1 flex-center flex-column"
                                  >
                                    <img
                                      alt="image"
                                      src={"/img/dashboard/upload.svg"}
                                    />
                                    <div className="text-16 fw-500 dark-purple mt-10">
                                      Upload Logo
                                    </div>
                                  </label>
                                </div>
                              )}
                            </Upload>
                          </div>

                          {/* end logo */}

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.companyName"
                                value={formData?.companyProfile?.companyName}
                                defaultValue={General[0]?.value || ""}
                                required
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {General[0]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.industry"
                                value={formData?.companyProfile?.industry}
                                defaultValue={General[1]?.value || ""}
                                required
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {General[1]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.description"
                                value={formData?.companyProfile?.description}
                                defaultValue={General[2]?.value || ""}
                                required
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {General[2]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.foundedYear"
                                value={formData?.companyProfile?.foundedYear}
                                defaultValue={General[3]?.value || ""}
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {General[3]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.employees"
                                value={formData?.companyProfile?.employees}
                                defaultValue={General[4]?.value || ""}
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {General[4]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="mt-30">
                            <h3 className="text-18 fw-500 mb-20">
                              Certificates
                            </h3>

                            {General[5]?.value?.length > 0 ? (
                              General[5]?.value?.split(", ").map(
                                (
                                  certificate,
                                  index // Split string back into array
                                ) => (
                                  <div
                                    key={index}
                                    className="contactForm row y-gap-30 items-center"
                                  >
                                    <div className="col-lg-10">
                                      <div className="form-input">
                                        <input
                                          type="text"
                                          value={certificate ?? ""}
                                          onChange={(e) =>
                                            handleItemChange(
                                              e,
                                              index,
                                              "",
                                              "certifications"
                                            )
                                          } // Update handler
                                        />
                                        <label className="lh-1 text-16 text-light-1">
                                          Certificate
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-lg-2">
                                      <button
                                        className="text-18 ml-20"
                                        onClick={() =>
                                          handleRemoveItem(
                                            index,
                                            "certifications"
                                          )
                                        } // Delete handler
                                      >
                                        <i className="icon-delete"></i>
                                      </button>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div>
                                <span className="text-16">
                                  No certificates provided
                                </span>
                              </div>
                            )}

                            <div className="mt-30">
                              <button
                                className="button -md -outline-dark-1 bg-light-1"
                                onClick={handleAddCertificate}
                              >
                                <i className="icon-add-button text-16 mr-10"></i>
                                Add Certificates
                              </button>
                            </div>
                          </div>

                          {/* this is for awardss!!!!! */}

                          <div className="mt-30">
                            <h3 className="text-18 fw-500 mb-20">Awards</h3>

                            {formData?.companyProfile?.awards.length > 0 ? (
                              formData?.companyProfile.awards.map(
                                (award, index) => (
                                  <div
                                    key={index}
                                    className="contactForm row y-gap-30 items-center"
                                  >
                                    <div className="col-lg-4">
                                      <div className="form-input">
                                        <input
                                          type="text"
                                          value={award.title ?? ""}
                                          onChange={
                                            (e) =>
                                              handleItemChange(
                                                e,
                                                index,
                                                "title",
                                                "awards"
                                              ) // Update the title
                                          }
                                          required
                                        />
                                        <label className="lh-1 text-16 text-light-1">
                                          Title
                                        </label>
                                      </div>
                                    </div>

                                    <div className="col-lg-4">
                                      <div className="form-input">
                                        <input
                                          type="text"
                                          value={award.issuer ?? ""}
                                          onChange={
                                            (e) =>
                                              handleItemChange(
                                                e,
                                                index,
                                                "issuer",
                                                "awards"
                                              ) // Update the issuer
                                          }
                                          required
                                        />
                                        <label className="lh-1 text-16 text-light-1">
                                          Issuer
                                        </label>
                                      </div>
                                    </div>

                                    <div className="col-lg-4">
                                      <div className="d-flex items-center">
                                        <div className="form-input">
                                          <input
                                            type="text"
                                            value={award.year ?? ""}
                                            onChange={
                                              (e) =>
                                                handleItemChange(
                                                  e,
                                                  index,
                                                  "year",
                                                  "awards"
                                                ) // Update the year
                                            }
                                            required
                                          />
                                          <label className="lh-1 text-16 text-light-1">
                                            Year
                                          </label>
                                        </div>

                                        <button
                                          className="text-18 ml-20"
                                          onClick={() =>
                                            handleRemoveItem(index, "awards")
                                          }
                                        >
                                          <i className="icon-delete"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div>
                                <span className="text-16 ">
                                  Awards not provided
                                </span>
                              </div>
                            )}

                            <div className="mt-30">
                              <button
                                className="button -md -outline-dark-1 bg-light-1"
                                onClick={handleAddAward}
                              >
                                <i className="icon-add-button text-16 mr-10"></i>
                                Add Award
                              </button>
                            </div>
                          </div>

                          <div className="col-12">
                            <button
                              className="button -md -dark-1 bg-accent-1 text-white"
                              onClick={handleSubmit}
                            >
                              Save Changes
                              <i className="icon-arrow-top-right text-16 ml-10"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`tabs__pane  ${activeTab == "Location" ? "is-tab-el-active" : ""
                          }`}
                      >
                        <div className="contactForm row y-gap-30">
                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.headquarters.address"
                                value={
                                  formData?.companyProfile?.headquarters
                                    ?.address
                                }
                                defaultValue={Location[0]?.value || ""}
                                required
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {Location[0]?.label}
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.headquarters.city"
                                value={
                                  formData?.companyProfile?.headquarters?.city
                                }
                                defaultValue={Location[1]?.value || ""}
                                required
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {Location[1]?.label}
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.headquarters.country"
                                value={
                                  formData?.companyProfile?.headquarters
                                    ?.country
                                }
                                defaultValue={Location[2]?.value || ""}
                                required
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {Location[2]?.label}
                              </label>
                            </div>
                          </div>
                        </div>
                        <button
                          className="button -md -dark-1 bg-accent-1 text-white mt-30"
                          onClick={handleSubmit}
                        >
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>

                      <div
                        className={`tabs__pane  ${activeTab == "Contact" ? "is-tab-el-active" : ""
                          }`}
                      >
                        <div className="contactForm row y-gap-30">
                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="email"
                                value={formData?.email}
                                defaultValue={Contact[0]?.value || ""}
                                required
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {Contact[0]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="website"
                                value={formData?.website}
                                defaultValue={Contact[1]?.value || ""}
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {Contact[1]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.socialMedia.linkedin"
                                value={
                                  formData?.companyProfile?.socialMedia.linkedin
                                }
                                defaultValue={Contact[2]?.value || ""}
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {Contact[2]?.label}
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input">
                              <input
                                type="text"
                                name="companyProfile.socialMedia.twitter"
                                value={
                                  formData?.companyProfile?.socialMedia.twitter
                                }
                                defaultValue={Contact[3]?.value || ""}
                                onChange={handleChange}
                              />
                              <label className="lh-1 text-16 text-light-1">
                                {Contact[3]?.label}
                              </label>
                            </div>
                          </div>
                        </div>
                        <button
                          className="button -md -dark-1 bg-accent-1 text-white mt-30"
                          onClick={handleSubmit}
                        >
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-50 rounded-12 bg-white shadow-2 px-40 pt-40 pb-30">
              <h5 className="text-20 fw-500 mb-30">Change Password</h5>
              <div className="contactForm y-gap-30">
                <div className="row y-gap-30">
                  <div className="col-md-6">
                    <div className="form-input ">
                      <input
                        type={
                          showPassword.oldPassword ? "text" : "password"
                        }
                        name="oldPassword"
                        value={PasswordForm.oldPassword}
                        onChange={handlePasswordInput}
                        required
                        minLength={6}
                      />
                      <label className="lh-1 text-16 text-light-1">
                        Old password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("oldPassword")
                        }
                        className="password-toggle"
                      >
                        {showPassword.oldPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-input ">
                      <input
                        type={
                          showPassword.newPassword ? "text" : "password"
                        }
                        name="newPassword"
                        value={PasswordForm.newPassword}
                        onChange={handlePasswordInput}
                        required
                        minLength={6}
                      />
                      <label className="lh-1 text-16 text-light-1">
                        New password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("newPassword")
                        }
                        className="password-toggle"
                      >
                        {showPassword.newPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-input ">
                      <input
                        type={
                          showPassword.confirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        value={PasswordForm.confirmPassword}
                        onChange={handlePasswordInput}
                        required
                        minLength={6}
                      />
                      <label className="lh-1 text-16 text-light-1">
                        Confirm new password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        className="password-toggle"
                      >
                        {showPassword.confirmPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <button onClick={handleChangePassword} className="button -md -dark-1 bg-accent-1 text-white">
                      Save Changes
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <FooterThree />

    </>
  );
}
