import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, getProfileData } from "../../api/TourGuideService";
import ChangePassword from "../../components/common/ChangePassword";
import { requestAccountDeletion } from "../../api/RequestService";
import { message } from 'antd';
import languages from "../../assets/constants/Languages";
import { nationalities } from "../../assets/Nationalities";
import moment from "moment";
import Upload from "antd/es/upload/Upload";

import Stars from '../../components/common/Stars'
const TourGuideProfile = () => {
  const [loading, setLoading] = useState(false);
  const tabs = ["Personal Information", "Education", "Previous Work"];
  const [activeTab, setActiveTab] = useState("Personal Information");
  const navigate = useNavigate();
  const [isActiveDD1, setIsActiveDD1] = useState(false);
  const [isActiveDD2, setIsActiveDD2] = useState(false);
  const handleDeletion = async () => {
    console.log("requested")
    try {
      const response = await requestAccountDeletion();
      message.success(response.message);
      navigate("/");
    } catch (error) {
      message.warning(error.response?.data?.message || "An error occurred");
    }
  };

  const [workChanged, setWorkChanged] = useState(false);
  const [educationChanged, setEducationChanged] = useState(false);
  const [languagesChanged, setLanguagesChanged] = useState(false);
  const [activePrevWork, setActivePrevWork] = useState(0);
  const [formData, setFormData] = useState({
    initialEmail: "",
    initialName: "",
    initialMobileNumber: "",
    initialNationality: "",
    initialYearsOfExperience: 0,
    initialProfilePicture: "",
    name: "",
    email: "",
    userName: "",
    mobileNumber: "",
    nationality: "",
    yearsOfExperience: 0,
    languagesSpoken: [],
    education: [],
    previousWork: [],
    currProfilePicture: "",
    averageRating: 0,
  });

  useEffect(() => {
    const getTourGuideData = async () => {
      try {
        setLoading(true);
        const profileData = await getProfileData();
        const data = profileData.data;
        for (let i = 0; i < data.previousWork.length; i++) {
          data.previousWork[i].startDate = moment(
            data.previousWork[i].startDate
          ).isValid()
            ? moment(data.previousWork[i].startDate)
            : null;
          data.previousWork[i].endDate = moment(
            data.previousWork[i].endDate
          ).isValid()
            ? moment(data.previousWork[i].endDate)
            : null;
        }
        setFormData({
          initialEmail: data.email || "",
          initialName: data.name || "",
          initialMobileNumber: data.mobileNumber || "",
          initialNationality: data.nationality || "",
          initialYearsOfExperience: data.yearsOfExperience || 0,
          initialProfilePicture: data.profilePicture || "",
          currProfilePicture: data.profilePicture || "",
          userName: data.userName || "",
          averageRating: data.averageRating || 0,
          email: data.email || "",
          name: data.name || "",
          mobileNumber: data.mobileNumber || "",
          nationality: data.nationality || "",
          yearsOfExperience: data.yearsOfExperience || 0,
          languagesSpoken: data.languagesSpoken || [],
          education: data.education || [],
          previousWork: data.previousWork || [],
        });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Failed to fetch profile data");
      }
    };

    getTourGuideData();
  }, []);
  const handelInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  }

  // useEffect(() => {
  //   form.setFieldsValue({
  //     email: formData.email,
  //     name: formData.name,
  //     mobileNumber: formData.mobileNumber,
  //     yearsOfExperience: formData.yearsOfExperience,
  //     nationality: formData.nationality,
  //     languagesSpoken: formData.languagesSpoken,
  //     education: formData.education,
  //     previousWork: formData.previousWork,
  //   });
  // }, [formData, form]);
  // const handleImageChange = (event, func) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       func(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = (info) => {
    console.log(info)
    if (info.target.files.length === 0) {
      setFormData({ ...formData, currProfilePicture: null });
      return;
    }

    const file = info.target.files[0].originFileObj || info.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, currProfilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeforeUpload = (file) => {
    if (formData.currProfilePicture) {
      message.error("Only one logo can be uploaded.");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, currProfilePicture: reader.result });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = () => {
    setFormData({ ...formData, currProfilePicture: null });
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log(formData);
    let hasChanges = false;

    const changedFields = {};
    for (const key in formData) {
      if (key.startsWith("initial")) continue;
      if (key === "currProfilePicture") {
        // detect image change
        if (formData.initialProfilePicture !== formData.currProfilePicture) {
          hasChanges = true;
          if (formData.initialProfilePicture !== "")
            changedFields["initialProfilePicture"] =
              formData["initialProfilePicture"];

          if (formData.currProfilePicture !== "") {
            changedFields["currProfilePicture"] =
              formData["currProfilePicture"];
          }
        }
        continue;
      }
      if (key === "previousWork") {
        if (workChanged) {
          hasChanges = true;
          changedFields[key] = formData[key];
        }
        continue;
      }
      if (key === "education") {
        if (educationChanged) {
          hasChanges = true;
          changedFields[key] = formData[key];
        }
        continue;
      }
      if (key === "languagesSpoken") {
        if (languagesChanged) {
          hasChanges = true;
          changedFields[key] = formData[key];
        }
        continue;
      }
      const initialKey = `initial${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (formData[key] !== formData[initialKey]) {
        hasChanges = true;
        changedFields[key] = formData[key];
      }
    }

    if (!hasChanges) {
      message.warning(
        "At least one field must be edited to update the product."
      );
      setLoading(false);
      return;
    }
    // formatting data
    if (changedFields.previousWork)
      changedFields.previousWork = Object.values(
        changedFields.previousWork
      ).filter((item) => item !== undefined);
    if (changedFields.education)
      changedFields.education = Object.values(changedFields.education).filter(
        (item) => item !== undefined
      );

    try {
      await updateProfile(changedFields);
      message.success("Profile updated successfully!");
      navigate(`/tourguide/profile`);
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }


  return (
    <div>

      {/* <TourguideNavBar /> */}
      {/* <div
        className={`dashboard ${
          sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}
      > */}
      {/* <Sidebar setSideBarOpen={setSideBarOpen} /> */}

      <div className="dashboard__content">
        {/* <Header setSideBarOpen={setSideBarOpen} /> */}

        <div className="dashboard__content_content">
          <h1 className="text-35">My Profile</h1>
          <p className="text-20">{formData.name}</p>
          <div className="mt-50 rounded-12 bg-white shadow-2 px-40 pt-40 pb-30">

            {/* <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-60"> */}
            <div className="tabs -underline-2 js-tabs">
              <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
                {tabs.map((elm, i) => (
                  <div
                    onClick={() => { setActiveTab(elm);  setActivePrevWork(-1); }}
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
                      className={`tabs__pane  ${activeTab == "Personal Information" ? "is-tab-el-active" : ""
                        }`}
                    >
                     
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


                          .absoluteIcon1 {
                              position: absolute;
                              top: 10px;
                              right: 10px;
                              border-radius: 12px;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              background-color: white;
                              width: 37px;
                              height: 37px;
                            }
                              .absoluteIcon2 {
                              bottom:5px
                              border-radius: 12px;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              background-color: white;
                              width: 37px;
                              height: 37px;
                            }
                        `}
                        </style>

                        <div className="col-12">
                          <h4 className="text-18 fw-500 mb-20">Your photo</h4>
                          <div className="row x-gap-20 y-gap">
                            {formData.currProfilePicture ? (
                              <div className="col-auto">
                                <div className="relative">
                                  <img
                                    src={formData.currProfilePicture}
                                    alt="image"
                                    className="size-200 rounded-12 object-cover"
                                  />
                                  <div style={{ display: "flex", gap: "5px" }}>
                                    <button
                                      onClick={handleRemove}
                                      className="absoluteIcon1 button -dark-1"
                                    >
                                      <i className="icon-delete text-18"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>) : (
                              <div className="col-auto  ">
                                <label
                                  htmlFor="imageInp1"
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
                                  onChange={handleImageChange}
                                  accept="image/*"
                                  id="imageInp1"
                                  type="file"
                                  style={{ display: "none" }}
                                />
                              </div>)}
                          </div>
                        </div>
                        <div className="col-2">
                          <div className="row x-gap-20 y-gap">
                            <div className="d-flex x-gap-5 pr-10">
                              <Stars star={formData?.averageRating} font={12} />
                            </div>
                            {formData?.averageRating}
                          </div>
                        </div>
                        <div className="row pt-40">
                        <div className="contactForm row y-gap-30">
                          {/* <div className="col-xl-9 col-lg-10"> */}
                          <div className="col-md-6">
                            <div className="form-input ">

                              <input type="text" value={formData.name} onChange={(e) => handelInputChange("name", e.target.value)} />
                              <label className="lh-1 text-16 text-light-1">Name</label>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-input ">

                              <input type="text" value={formData.userName} readOnly />

                              <label className="lh-1 text-16 text-light-1">
                                userName
                              </label>

                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-input ">

                              <input type="text" value={formData.mobileNumber} onChange={(e) => handelInputChange("mobileNumber", e.target.value)} />
                              <label className="lh-1 text-16 text-light-1">PhoneNumber</label>

                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-input ">
                              <input type="text" value={formData.email} onChange={(e) => handelInputChange("email", e.target.value)} />
                              <label className="lh-1 text-16 text-light-1">Email</label>

                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-input ">

                              <input type="text" value={formData.yearsOfExperience} onChange={(e) => handelInputChange("yearsOfExperience", e.target.value)} />

                              <label className="lh-1 text-16 text-light-1">Years of Experience</label>

                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-input ">
                              <div className="select js-multiple-select">
                                <button className="select__button js-button">
                                  <span
                                    onClick={() => setIsActiveDD1((pre) => !pre)}
                                    className="js-button-title"
                                  >
                                    {formData.languagesSpoken.length ? <>{formData.languagesSpoken.join(", ")}</> : "Languages"}
                                  </span>
                                  <i className="select__icon" data-feather="chevron-down"></i>
                                </button>

                                <div
                                  className={`select__dropdown js-dropdown js-form-dd ${isActiveDD1 ? "-is-visible" : ""
                                    } `}
                                >
                                  <div className="select__options js-options">
                                    {languages.map((elm, i) => (
                                      <div
                                        onClick={() => {
                                          setFormData((formData) =>
                                            formData.languagesSpoken.includes(elm)
                                              ? { ...formData, languagesSpoken: formData.languagesSpoken.filter((el) => el != elm) }
                                              : { ...formData, languagesSpoken: [...formData.languagesSpoken, elm] }
                                          )
                                          setLanguagesChanged(true);
                                        }}
                                        key={i}
                                        className="select__options__button"
                                      >
                                        <div className="form-checkbox pointer-events-none">
                                          <input
                                            readOnly
                                            checked={formData.languagesSpoken.includes(elm)}
                                            type="checkbox"
                                          />

                                          <div className="form-checkbox__mark">
                                            <div className="form-checkbox__icon icon-check text-white"></div>
                                          </div>
                                        </div>

                                        <span className="ml-10 js-target-title">{elm}</span>

                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>


                          <div className="col-md-6">
                            <div className="form-input ">
                              <div className="select js-multiple-select">
                                <button className="select__button js-button">
                                  <span
                                    onClick={() => setIsActiveDD2((pre) => !pre)}
                                    className="js-button-title"
                                  >
                                    {formData.nationality !== "" ? formData.nationality : "Nationality"}
                                  </span>
                                  <i className="select__icon" data-feather="chevron-down"></i>
                                </button>

                                <div
                                  className={`select__dropdown js-dropdown js-form-dd ${isActiveDD2 ? "-is-visible" : ""
                                    } `}
                                >
                                  <div className="select__options js-options">
                                    {nationalities.map((elm, i) => (
                                      <div
                                        onClick={() =>
                                          setFormData((formData) =>
                                            formData.nationality === elm
                                              ? { ...formData, nationality: "" }
                                              : { ...formData, nationality: elm }
                                          )
                                        }
                                        key={i}
                                        className="select__options__button"
                                      >
                                        <div className="form-checkbox pointer-events-none">
                                          <input
                                            readOnly
                                            checked={formData.nationality === elm}
                                            type="checkbox"
                                          />

                                          <div className="form-checkbox__mark">
                                            <div className="form-checkbox__icon icon-check text-white"></div>
                                          </div>
                                        </div>

                                        <span className="ml-10 js-target-title">{elm}</span>

                                      </div>


                                    ))}


                                  </div>
                                </div>

                              </div>



                            </div>
                          </div>






                        </div>
                      </div>
                    </div>

                    <div
                      className={`tabs__pane  ${activeTab == "Education" ? "is-tab-el-active" : ""
                        }`}
                    >

                      <div className="contactForm row y-gap-30">
                        <div className="mt-30">
                          {/* <h3 className="text-18 fw-500 mb-20">Education</h3> */}
                          {formData?.education?.length > 0 ? (
                            formData?.education.map(
                              (edu, index) => (
                                <div
                                  key={index}
                                  className="contactForm row y-gap-30 items-center"
                                >
                                  <h5 className="text-20 fw-500 ">{`Education ${index + 1}`}</h5>

                                  <div className="col-lg-4">
                                    <div className="form-input">
                                      <input
                                        type="text"
                                        value={edu.degree ?? ""}
                                        onChange={(e) => {
                                          setEducationChanged(true);
                                          setFormData({
                                            ...formData,
                                            education: formData.education.map((item, i) =>
                                              i === index ? { ...item, degree: e.target.value } : item
                                            ),
                                          });
                                        }}
                                        required
                                      />
                                      <label className="lh-1 text-16 text-light-1">
                                        Degree
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-lg-3">
                                    <div className="form-input">
                                      <input
                                        type="text"
                                        value={edu.institution ?? ""}
                                        onChange={(e) => {
                                          setEducationChanged(true);
                                          setFormData({
                                            ...formData,
                                            education: formData.education.map((item, i) =>
                                              i === index ? { ...item, institution: e.target.value } : item
                                            ),
                                          });
                                        }}
                                        required
                                      />
                                      <label className="lh-1 text-16 text-light-1">
                                        Institution
                                      </label>
                                    </div>
                                  </div>

                                  <div className="col-lg-3">

                                    <div className="form-input">
                                      <input
                                        type="text"
                                        value={edu.yearOfCompletion ?? ""}
                                        onChange={(e) => {
                                          setEducationChanged(true);
                                          setFormData({
                                            ...formData,
                                            education: formData.education.map((item, i) =>
                                              i === index ? { ...item, yearOfCompletion: e.target.value } : item
                                            ),
                                          });
                                        }}
                                        required
                                      />
                                      <label className="lh-1 text-16 text-light-1">
                                        Year of Completion
                                      </label>
                                    </div>

                                  </div>
                                  <div className="col-lg-1">
                                    <button
                                      onClick={() => {
                                        setEducationChanged(true);
                                        setFormData({ ...formData, education: formData.education.filter((elm, idx) => idx !== index) })
                                      }}
                                      className="text-18 ml-20 absoluteIcon2 button -dark-1"
                                    >
                                      <i className="icon-delete text-18"></i>
                                    </button>
                                  </div>
                                </div>


                              )
                            )
                          ) : (
                            <div>
                              <span className="text-16 ">
                                No Education Provided
                              </span>
                            </div>
                          )}

                          <div className="mt-30">
                            <button
                              className="button -md -outline-dark-1 bg-light-1"
                              onClick={() =>
                                setFormData({
                                  ...formData, education: [...formData.education, {
                                    degree: "", institution: "", yearOfCompletion: ""
                                  }]
                                })}
                            >
                              <i className="icon-add-button text-16 mr-10"></i>
                              Add Education
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tabs__pane  ${activeTab == "Previous Work" ? "is-tab-el-active" : ""
                        }`}
                    >
                      <div className="contactForm row y-gap-30">
                        <div className="mt-30">

                          {formData?.previousWork?.length > 0 ? (
                            formData?.previousWork.map(
                              (prevWork, index) => (

                                <div
                                  key={index}
                                  className="contactForm row y-gap-30 items-center"
                                >
                                  <div className="col-lg-10">
                                    <h5 className="text-20 fw-500 ">{`Previous Work ${index + 1}`}</h5>
                                  </div>
                                  <div className="col-lg-1">
                                    <button
                                      onClick={() => {
                                        setFormData({ ...formData, previousWork: formData.previousWork.filter((elm, idx) => idx !== index) })
                                        setWorkChanged(true);
                                      }}
                                      className="text-18 ml-20 absoluteIcon2 button -dark-1"
                                    >
                                      <i className="icon-delete text-18"></i>
                                    </button>
                                  </div>
                                  {activePrevWork === index ?
                                    <div className="col-lg-1">
                                      <button
                                        onClick={() =>
                                          setActivePrevWork(-1)
                                        }
                                        className="text-18 ml-20 absoluteIcon2 button -dark-1"
                                      >
                                        <i className="icon-minus text-18"></i>
                                      </button>

                                    </div> :
                                    <div className="col-lg-1">
                                      <button
                                        onClick={() =>
                                          setActivePrevWork(index)
                                        }
                                        className="text-18 ml-20 absoluteIcon2 button -dark-1"
                                      >
                                        <i className="icon-chevron-down text-18"></i>
                                      </button>

                                    </div>}
                                  <div
                                    className={`tabs__pane  ${activePrevWork === index ? "is-tab-el-active" : ""
                                      }`}
                                  >
                                    <div className="col-12">
                                      <div className="row x-gap-20 y-gap">
                                        <div className="col-lg-4">
                                          <div className="form-input">
                                            <input
                                              type="text"
                                              value={prevWork.companyName ?? ""}
                                              onChange={(e) => {
                                                setWorkChanged(true);
                                                setFormData({
                                                  ...formData,
                                                  previousWork: formData.previousWork.map((item, i) =>
                                                    i === index ? { ...item, companyName: e.target.value } : item
                                                  ),
                                                });
                                              }}
                                              required={true}
                                            />
                                            <label className="lh-1 text-16 text-light-1">
                                              Company Name
                                            </label>
                                          </div>
                                        </div>

                                        <div className="col-lg-4">
                                          <div className="form-input">
                                            <input
                                              type="text"
                                              value={prevWork.position ?? ""}
                                              onChange={(e) => {
                                                setWorkChanged(true);
                                                setFormData({
                                                  ...formData,
                                                  previousWork: formData.previousWork.map((item, i) =>
                                                    i === index ? { ...item, position: e.target.value } : item
                                                  ),
                                                });
                                              }}
                                              required={true}
                                            />
                                            <label className="lh-1 text-16 text-light-1">
                                              Position
                                            </label>
                                          </div>
                                        </div>
                                        <div className="col-lg-4">

                                          <div className="form-input">
                                            <input
                                              type="text"
                                              value={prevWork.location ?? ""}
                                              onChange={(e) => {
                                                setWorkChanged(true);
                                                setFormData({
                                                  ...formData,
                                                  previousWork: formData.previousWork.map((item, i) =>
                                                    i === index ? { ...item, location: e.target.value } : item
                                                  ),
                                                });
                                              }}
                                              required={true}
                                            />
                                            <label className="lh-1 text-16 text-light-1">
                                              Location
                                            </label>

                                          </div>
                                        </div>
                                      </div></div>
                                    <div className="col-12">
                                      <div className="row  y-gap">
                                        <div className="col-lg-6">

                                          <div className="form-input ">

                                            <input
                                              type="date"

                                              value={prevWork.startDate ? new Date(prevWork.startDate).toISOString().split('T')[0] : null}
                                              onChange={(e) => {
                                                setWorkChanged(true);
                                                setFormData({
                                                  ...formData,
                                                  previousWork: formData.previousWork.map((item, i) =>
                                                    i === index ? { ...item, startDate: e.target.value } : item
                                                  ),
                                                });
                                              }}
                                              // Sets minimum date to today
                                              required={true}
                                            />


                                            <label className="lh-1 text-16 text-light-1"> Start Date</label>
                                          </div>

                                        </div>



                                        <div className="col-lg-6">
                                          <div className="form-input ">

                                            <input type="date" value={prevWork.endDate ? new Date(prevWork.endDate).toISOString().split('T')[0] : null}
                                              onChange={(e) => {
                                                setWorkChanged(true);
                                                setFormData({
                                                  ...formData,
                                                  previousWork: formData.previousWork.map((item, i) =>
                                                    i === index ? { ...item, endDate: e.target.value } : item
                                                  ),
                                                });
                                              }}
                                              // Sets minimum date to today
                                              required={true} />
                                            <label className="lh-1 text-16 text-light-1"> End Date </label>

                                          </div>
                                        </div>


                                      </div></div>

                                    <div className="col-md-12">
                                      <div className="row x-gap-20 y-gap">
                                        <label style={{ color: 'black', marginBottom: '10px' }} className="lh-1 text-16 text-light-1">Description</label>
                                        <div className="form-input ">
                                          <textarea value={prevWork.description} onChange={(e) => {
                                            setWorkChanged(true);
                                            setFormData({
                                              ...formData,
                                              previousWork: formData.previousWork.map((item, i) =>
                                                i === index ? { ...item, description: e.target.value } : item
                                              ),
                                            });
                                          }} rows="3"
                                            required={true} />
                                        </div>
                                      </div>
                                    </div>

                                    <br />
                                  </div>
                                </div>


                              )
                            )
                          ) : (
                            <div>
                              <span className="text-16 ">
                                No previous Work is Provided
                              </span>
                            </div>
                          )}

                          <div className="mt-30">
                            <button
                              className="button -md -outline-dark-1 bg-light-1"
                              onClick={() =>{
                                setFormData({
                                  ...formData, previousWork: [...formData.previousWork, {
                                    companyName: "",
                                    position: "",
                                    location: "",
                                    startDate: new Date().toISOString().split("T")[0],
                                    endDate: new Date().toISOString().split("T")[0],
                                    description: "",
                                  }]
                                });
                                setActivePrevWork(formData.previousWork.length);
                              }}
                            >
                              <i className="icon-add-button text-16 mr-10"></i>
                              Add Previous Work
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>





                    <div className="col-lg-4">

                      <button className="button -md -dark-1 bg-accent-1 text-white mt-30" onClick={() => {
                        handleSubmit();
                      }}>
                        Save Changes
                        <i className="icon-arrow-top-right text-16 ml-10"></i>
                      </button>

                    </div>
                    <div style={{ position: "relative", height: "100%" }}>

                      <button style={{
                        position: "absolute",
                        bottom: "0px", // Adjust as needed
                        right: "0px",  // Adjust as needed
                      }} className="button -md -dark-1 bg-accent-1 text-white mt-30" onClick={() => {
                        handleDeletion();
                      }}>
                        Delete Account
                        <i className="icon-delete text-16 ml-10"></i>
                      </button>


                    </div>
                  </div>
                </div>
              </div>
            </div >
          </div >


         
        </div>
      </div>
    </div >



  );
};

export default TourGuideProfile;
