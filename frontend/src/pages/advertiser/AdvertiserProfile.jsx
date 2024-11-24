
//import Sidebar from "./Sidebar";
import Header from "../../components/dasboard/Header";
import Map from "../../components/pages/contact/Map";
import React, { useEffect, useState } from "react";
import { getAdvertiser } from "../../api/AdvertiserService";
import { useParams, useNavigate } from "react-router-dom";
//import AdvertiserNavBar from "../../components/navbar/AdvertiserNavBar";
//import ChangePassword from "../../components/common/ChangePassword";
import { requestAccountDeletion } from "../../api/RequestService";
import { message } from 'antd';


const tabs = ["General", "Location", "Contact"];
export default function AdvertiserProfile() {
  //const [sideBarOpen, setSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("General");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("/img/dashboard/addtour/1.jpg");
  const [image3, setImage3] = useState("/img/dashboard/addtour/2.jpg");
  const [image4, setImage4] = useState("/img/dashboard/addtour/3.jpg");
  const [advertiser, setAdvertiser] = useState(null);

  const handleImageChange = (event, func) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        func(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const data = await getAdvertiser(); // Make the API call
        console.log(data);
        console.log("im in use effect")
        setAdvertiser(data);
      } catch (error) {
        setError(error);
        console.error("Error fetching advertiser:", error); // This should log if there's an error

      }
    };

    fetchAdvertiser();

  }, []);


  const handleDeletion = async () => {
    try {
      const response = await requestAccountDeletion();
      message.success("Account deletion request submitted successfully.");
      message.success(response.message);
      navigate("/");
    } catch (error) {
      message.warning(error.response?.data?.message || "An error occurred");
    }
  };


  console.log(advertiser)
  const General = advertiser
  ? [
    { label: "Company Name", value: advertiser.companyProfile?.companyName },
    { label: "Industry", value: advertiser.companyProfile?.industry },
    { label: "Description", value: advertiser.companyProfile?.description },
    { label: "Founded Year", value: advertiser.companyProfile?.foundedYear },
    { label: "Employees", value: advertiser.companyProfile?.employees },   
    {
      label: "Certifications",
      value: advertiser.companyProfile?.certifications?.join(", "),
    },
    
  ]  : [] ;

  const Contact= advertiser
  ?[
    { label: "Email", value: advertiser.email },
    { label: "Website", value: advertiser.website,
      isLink: true,
    },
    {
        label: "LinkedIn",
        value: advertiser.companyProfile?.socialMedia?.linkedin,
        isLink: true,
      },
      {
        label: "Twitter",
        value: advertiser.companyProfile?.socialMedia?.twitter,
        isLink: true,
      },
  ] : [];

  const Location = advertiser
  ? [
      {
        label: "Address",
        value: advertiser.companyProfile?.headquarters?.address,
      },
      { label: "City", value: advertiser.companyProfile?.headquarters?.city },
      {
        label: "Country",
        value: advertiser.companyProfile?.headquarters?.country,
      },
      
  ]: [];

  return (
    <>
      <div>

      <style>
      {`
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
        <div className="dashboard__content">
          {/* <Header setSideBarOpen={setSideBarOpen} /> */}

          <div className="dashboard__content_content">
            <h1 className="text-30">Profile</h1>
            {/* <p className="">Lorem ipsum dolor sit amet, consectetur.</p> */}

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
                        className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${
                          activeTab == elm ? "is-tab-el-active" : ""
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
                        className={`tabs__pane  ${
                          activeTab == "General" ? "is-tab-el-active" : ""
                        }`}
                      >
                        <div className="contactForm row y-gap-30">
                          <div className="col-12">
                            

                          {image2 ? (
                                <div className="col-auto  ">
                                  <div className="relative">
                                    <img
                                      src={image2}
                                      alt="image"
                                      className="size-200 rounded-12 object-cover"
                                    />
                                    <button
                                      onClick={() => {
                                        setImage2("");
                                      }}
                                      className="absoluteIcon1 button -dark-1"
                                    >
                                      <i className="icon-delete text-18"></i>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="col-auto  ">
                                  <label
                                    htmlFor="imageInp2"
                                    className="size-200 rounded-12 border-dash-1 bg-accent-1-05 flex-center flex-column"
                                  >
                                    <img
                                      alt="image"
                                      src={"/img/dashboard/upload.svg"}
                                    />

                                    <div className="text-16 fw-500 text-accent-1 mt-10">
                                      Upload Images
                                    </div>
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      handleImageChange(e, setImage2)
                                    }
                                    accept="image/*"
                                    id="imageInp2"
                                    type="file"
                                    style={{ display: "none" }}
                                  />
                                </div>
                              )}


                          </div>
                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={General[0]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {General[0]?.label }
                                    </label>
                                </div>
                            {/* {!General[0]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                            <div className="col-12">
                            <div className="form-input">
                                <input
                                type="text"
                                defaultValue={General[1]?.value || ""}
                                required
                                />
                                <label className="lh-1 text-16 text-light-1">
                                {General[1]?.label}
                                </label>
                            </div>
                            {/* {!General[1]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                            <div className="col-12">
                            <div className="form-input">
                                <input
                                type="text"
                                defaultValue={General[2]?.value || ""}
                                required
                                />
                                <label className="lh-1 text-16 text-light-1">
                                {General[2]?.label}
                                </label>
                            </div>
                            {/* {!General[2]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                            <div className="col-12">
                            <div className="form-input">
                                <input
                                type="text"
                                defaultValue={General[3]?.value || ""}
                                required
                                />
                                <label className="lh-1 text-16 text-light-1">
                                {General[3]?.label}
                                </label>
                            </div>
                            {/* {!General[3]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                            <div className="col-12">
                            <div className="form-input">
                                <input
                                type="text"
                                defaultValue={General[4]?.value || ""}
                                required
                                />
                                <label className="lh-1 text-16 text-light-1">
                                {General[4]?.label}
                                </label>
                            </div>
                            {/* {!General[4]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                            <div className="col-12">
                            <div className="form-input">
                                <input
                                type="text"
                                defaultValue={General[5]?.value || ""}
                                required
                                />
                                <label className="lh-1 text-16 text-light-1">
                                {General[5]?.label}
                                </label>
                            </div>
                            {/* {!General[5]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>


{/* this is for awardss!!!!! */}


                            {/* <div className="mt-30">
                            <h3 className="text-18 fw-500 mb-20">Awards</h3>

                            {advertiser.companyProfile?.awards.length > 0 ? (
                                advertiser.companyProfile.awards.map((award, index) => (
                                <div key={index} className="contactForm row y-gap-30 items-center">
                                    <div className="col-lg-4">
                                    <div className="form-input">
                                        <input type="text" defaultValue={award.title} required />
                                        <label className="lh-1 text-16 text-light-1">Title</label>
                                    </div>
                                    </div>

                                    <div className="col-lg-4">
                                    <div className="form-input">
                                        <input type="text" defaultValue={award.issuer} required />
                                        <label className="lh-1 text-16 text-light-1">Issuer</label>
                                    </div>
                                    </div>

                                    <div className="col-lg-4">
                                    <div className="d-flex items-center">
                                        <div className="form-input">
                                        <input type="text" defaultValue={award.year} required />
                                        <label className="lh-1 text-16 text-light-1">Year</label>
                                        </div>

                                        <button className="text-18 ml-20" onClick={() => handleDeleteAward(index)}>
                                        <i className="icon-delete"></i>
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <div>
                                <span className="text-16 text-light-1">Awards not provided</span>
                                <button className="button -md -outline-dark-1 bg-light-1" onClick={handleNavigate}>
                                    Add
                                </button>
                                </div>
                            )}

                            <div className="mt-30">
                                <button className="button -md -outline-dark-1 bg-light-1" onClick={handleAddAward}>
                                <i className="icon-add-button text-16 mr-10"></i>
                                Add Item
                                </button>
                            </div>
                            </div> */}



                          <div className="col-12">
                            <button className="button -md -dark-1 bg-accent-1 text-white">
                              Save Changes
                              <i className="icon-arrow-top-right text-16 ml-10"></i>
                            </button>
                          </div>
                        </div>
                      </div>








                      <div
                        className={`tabs__pane  ${
                          activeTab == "Location" ? "is-tab-el-active" : ""
                        }`}
                      >
                        <div className="contactForm row y-gap-30">
                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={Location[0]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {Location[0]?.label }
                                    </label>
                                </div>
                            {/* {!Location[0]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>
                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={Location[1]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {Location[1]?.label }
                                    </label>
                                </div>
                            {/* {!Location[1]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>
                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={Location[2]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {Location[2]?.label }
                                    </label>
                                </div>
                            {/* {!Location[2]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>
                            
                        </div>
                        <button className="button -md -dark-1 bg-accent-1 text-white mt-30">
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>



                      <div
                        className={`tabs__pane  ${
                          activeTab == "Contact" ? "is-tab-el-active" : ""
                        }`}
                      >
                        <div className="contactForm row y-gap-30">
                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={Contact[0]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {Contact[0]?.label }
                                    </label>
                                </div>
                            {/* {!Contact[0]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>


                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={Contact[1]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {Contact[1]?.label }
                                    </label>
                                </div>
                            {/* {!Contact[1]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={Contact[2]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {Contact[2]?.label }
                                    </label>
                                </div>
                            {/* {!Contact[2]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                            <div className="col-12">
                                <div className="form-input">
                                    <input
                                    type="text"
                                    defaultValue={Contact[3]?.value || ""}
                                    required
                                    />
                                    <label className="lh-1 text-16 text-light-1">
                                    {Contact[3]?.label }
                                    </label>
                                </div>
                            {/* {!Contact[3]?.value && (
                                <button style={buttonStyle} onClick={handleNavigate}>
                                Add
                                </button>
                            )} */}
                            </div>

                        </div>
                        <button className="button -md -dark-1 bg-accent-1 text-white mt-30">
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}

            </div>
          </div>
        </div>
      </div>

    </>
  );
}

