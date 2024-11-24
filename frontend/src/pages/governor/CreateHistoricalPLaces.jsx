import Sidebar from "./Sidebar";
import Header from "./Header";
import Map from "../pages/contact/Map";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { tourismGovernerID } from "../../IDs";
import { Form, Upload, Select, TimePicker, Input, InputNumber, Button } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import MapPopUp from "../../components/common/MapPopUp";
import { getAllPeriodTags } from '../../api/HistoricalPlacePeriodService';
import { getAllTypeTags } from '../../api/HistoricalPlaceTagService';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { toast } from "react-toastify";
import { CreateNewHistoricalPlace, updateHistoricalPlace } from '../../api/HistoricalPlaceService';
const tabs = ["Content", "Location", "Pricing", "Included"];
export default function AddTour() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("/img/dashboard/addtour/1.jpg");
  const [image3, setImage3] = useState("/img/dashboard/addtour/2.jpg");
  const [image4, setImage4] = useState("/img/dashboard/addtour/3.jpg");

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
  const location = useLocation();
  const props = location.state?.place;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(props?.location?.address || "");
  const [tagsOptions, setTagsOption] = useState([]);
  const [periodTagsOptions, setPeriodTagsOption] = useState([]);
  const [deletedImages, setDeletedImages] = useState(new Set([]));
  const [newImages, setNewImages] = useState(new Set([]));
  const [coordinates, setCoordinates] = useState([
      props?.location?.coordinates?.latitude || 51.505,
      props?.location?.coordinates?.longitude || -0.09,
  ]);
  const [formData, setFormData] = useState({
      tourismGovernor: tourismGovernerID,
      name: props?.name || "",
      description: props?.description || "",
      images: new Set(props?.images || []),
      openingHours: {
          weekdays: {
              openingTime: props?.openingHours?.weekdays?.openingTime || '',
              closingTime: props?.openingHours?.weekdays?.closingTime || '',
          },
          weekends: {
              openingTime: props?.openingHours?.weekends?.openingTime || '',
              closingTime: props?.openingHours?.weekends?.closingTime || '',
          }
      },
      ticketPrices: {
          foreigner: props?.ticketPrices?.foreigner || 0,
          native: props?.ticketPrices?.native || 0,
          student: props?.ticketPrices?.student || 0,
      },
      tags: props?.tags || [],
      historicalPeriod: props?.historicalPeriod || []
  });
  const handleChoosingImage = (e) => {
      e.fileList.forEach(file => {
          if (file.status !== 'done') {
              const reader = new FileReader();
              reader.readAsDataURL(file.originFileObj);
              reader.onloadend = () => {
                  setNewImages((oldImages) => new Set(oldImages).add(
                      reader.result
                  ))

              }
          }
      });
  }
  useEffect(() => {
      const getHistoricalPeriods = async () => {
          setLoading(true);
          const PeriodTagsData = await getAllPeriodTags();
          if (PeriodTagsData) {
              setPeriodTagsOption(PeriodTagsData);
          }
          setLoading(false);
      };
      getHistoricalPeriods();
  }, []);
  useEffect(() => {
      const getHistoricalTags = async () => {
          setLoading(true);
          const typeTagsData = await getAllTypeTags();
          if (typeTagsData) {
              setTagsOption(typeTagsData);
          }
          setLoading(false);
      };
      getHistoricalTags();
  }, [])


  const normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
          return e;
      }
      return e?.fileList;
  };

  async function handleSubmission() {
      console.log("ia m hereee")
      const newHistoricalPlace = {
          tourismGovernor: tourismGovernerID
          ,
          name: formData.name
          ,
          description: formData.description,
          images: [...newImages],
          location: {
              address: address,
              coordinates: {
                  latitude: Number(coordinates[0]),
                  longitude: Number(coordinates[1]),
              }
          },
          openingHours: {
              weekdays: {
                  openingTime: (formData.openingHours.weekdays.openingTime).toString(),
                  closingTime: (formData.openingHours.weekdays.closingTime).toString(),

              },
              weekends: {
                  openingTime: (formData.openingHours.weekends.openingTime).toString(),
                  closingTime: (formData.openingHours.weekends.closingTime).toString(),
              },
          },
          ticketPrices: {
              foreigner: formData.ticketPrices.foreigner,
              native: formData.ticketPrices.native,
              student: formData.ticketPrices.student
          },
          tags: await formData.tags,
          historicalPeriod: await formData.historicalPeriod,
      };
      setLoading(true);
      console.log("historical Places", newHistoricalPlace);
      if (id === undefined) {
          try {
              const result = await CreateNewHistoricalPlace(newHistoricalPlace);
              if (result) {
                  setLoading(false);
                  toast.success('Historical place created successfully')
              }
          }
          catch (err) {
              toast.error(err);
              setLoading(false);
          }
      }
      else {
          try {
              const updatedHistoricalPlace = {
                  tourismGovernor: tourismGovernerID
                  ,
                  name: formData.name
                  ,
                  description: formData.description,
                  images: [...newImages],
                  location: {
                      address: address,
                      coordinates: {
                          latitude: Number(coordinates[0]),
                          longitude: Number(coordinates[1]),
                      }
                  },
                  openingHours: {
                      weekdays: {
                          openingTime: (formData.openingHours.weekdays.openingTime).toString(),
                          closingTime: (formData.openingHours.weekdays.closingTime).toString(),

                      },
                      weekends: {
                          openingTime: (formData.openingHours.weekends.openingTime).toString(),
                          closingTime: (formData.openingHours.weekends.closingTime).toString(),
                      },
                  },
                  ticketPrices: {
                      foreigner: formData.ticketPrices.foreigner,
                      native: formData.ticketPrices.native,
                      student: formData.ticketPrices.student
                  },
                  tags: await formData.tags,
                  historicalPeriod: await formData.historicalPeriod,
                  deletedImages: [...deletedImages]
              }
              console.log("in update ", updatedHistoricalPlace);
              const result = await updateHistoricalPlace(id, updatedHistoricalPlace);
              if (result) {
                  setLoading(false);
                  toast.success('Historical place Updated successfully')
              }

          } catch (err) {
              toast.error(err);
              setLoading(false);
          }
      }
  }
  const handleInputChange = (e) => {
      console.log(e.target.value);
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };
  const fileList = [...formData.images].map((image, index) => ({
      uid: image.public_id,
      name: `image-${index + 1}.png`,
      status: 'done',
      url: image.url,
  }));


  return (
    <>
      <div
        className={`dashboard ${
          sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}
      >
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className="dashboard__content">
          <Header setSideBarOpen={setSideBarOpen} />

          <div className="dashboard__content_content">
            <h1 className="text-30">Add Tour</h1>
            <p className="">Lorem ipsum dolor sit amet, consectetur.</p>

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
                          activeTab == "Content" ? "is-tab-el-active" : ""
                        }`}
                      >
                        <div className="contactForm row y-gap-30">
                          <div className="col-12">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Tour Title
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Category
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Keywords
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-input ">
                              <textarea required rows="8"></textarea>
                              <label className="lh-1 text-16 text-light-1">
                                Tour Content
                              </label>
                            </div>
                          </div>

                          <div className="col-12">
                            <h4 className="text-18 fw-500 mb-20">Gallery</h4>

                            <div className="row x-gap-20 y-gap-20">
                              {image1 ? (
                                <div className="col-auto  ">
                                  <div className="relative">
                                    <img
                                      src={image1}
                                      alt="image"
                                      className="size-200 rounded-12 object-cover"
                                    />
                                    <button
                                      onClick={() => {
                                        setImage1("");
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
                                    onChange={(e) =>
                                      handleImageChange(e, setImage1)
                                    }
                                    accept="image/*"
                                    id="imageInp1"
                                    type="file"
                                    style={{ display: "none" }}
                                  />
                                </div>
                              )}
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
                              {image3 ? (
                                <div className="col-auto ">
                                  <div className="relative">
                                    <img
                                      src={image3}
                                      alt="image"
                                      className="size-200 rounded-12 object-cover"
                                    />
                                    <button
                                      onClick={() => {
                                        setImage3("");
                                      }}
                                      className="absoluteIcon1 button -dark-1"
                                    >
                                      <i className="icon-delete text-18"></i>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="col-auto ">
                                  <label
                                    htmlFor="imageInp3"
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
                                      handleImageChange(e, setImage3)
                                    }
                                    accept="image/*"
                                    id="imageInp3"
                                    type="file"
                                    style={{ display: "none" }}
                                  />
                                </div>
                              )}
                              {image4 ? (
                                <div className="col-auto ">
                                  <div className="relative">
                                    <img
                                      src={image4}
                                      alt="image"
                                      className="size-200 rounded-12 object-cover"
                                    />
                                    <button
                                      onClick={() => {
                                        setImage4("");
                                      }}
                                      className="absoluteIcon1 button -dark-1"
                                    >
                                      <i className="icon-delete text-18"></i>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="col-auto ">
                                  <label
                                    htmlFor="imageInp4"
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
                                      handleImageChange(e, setImage4)
                                    }
                                    accept="image/*"
                                    id="imageInp4"
                                    type="file"
                                    style={{ display: "none" }}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="text-14 mt-20">
                              PNG or JPG no bigger than 800px wide and tall.
                            </div>
                          </div>

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
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                City
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                State
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Address
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Zip Code
                              </label>
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Map Latitude
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Map Longitude
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Map Zoom
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="map relative mt-30">
                          <Map />
                        </div>

                        <button className="button -md -dark-1 bg-accent-1 text-white mt-30">
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>

                      <div
                        className={`tabs__pane  ${
                          activeTab == "Pricing" ? "is-tab-el-active" : ""
                        }`}
                      >
                        <div className="contactForm row y-gap-30">
                          <div className="col-12">
                            <div className="form-input ">
                              <input type="text" required />
                              <label className="lh-1 text-16 text-light-1">
                                Tour Price
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-30">
                          <h3 className="text-18 fw-500 mb-20">Extra Price</h3>

                          <div className="contactForm row y-gap-30 items-center">
                            <div className="col-lg-4">
                              <div className="form-input ">
                                <input type="text" required />
                                <label className="lh-1 text-16 text-light-1">
                                  Add Service per booking
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="form-input ">
                                <input type="text" required />
                                <label className="lh-1 text-16 text-light-1">
                                  Description
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="d-flex items-center">
                                <div className="form-input ">
                                  <input type="text" required />
                                  <label className="lh-1 text-16 text-light-1">
                                    Price
                                  </label>
                                </div>

                                <button className="text-18 ml-20">
                                  <i className="icon-delete"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="contactForm row y-gap-30 items-center pt-10">
                            <div className="col-lg-4">
                              <div className="form-input ">
                                <input type="text" required />
                                <label className="lh-1 text-16 text-light-1">
                                  Add Service per booking
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="form-input ">
                                <input type="text" required />
                                <label className="lh-1 text-16 text-light-1">
                                  Description
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="d-flex items-center">
                                <div className="form-input ">
                                  <input type="text" required />
                                  <label className="lh-1 text-16 text-light-1">
                                    Price
                                  </label>
                                </div>

                                <button className="text-18 ml-20">
                                  <i className="icon-delete"></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-30">
                            <button className="button -md -outline-dark-1 bg-light-1">
                              <i className="icon-add-button text-16 mr-10"></i>
                              Add Item
                            </button>
                          </div>
                        </div>

                        <button className="button -md -dark-1 bg-accent-1 text-white mt-30">
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>

                      <div
                        className={`tabs__pane  ${
                          activeTab == "Included" ? "is-tab-el-active" : ""
                        }`}
                      >
                        <div className="row y-gap-20 justify-between">
                          <div className="col-md-8">
                            <div className="row y-gap-20">
                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">
                                    Beverages, drinking water, morning tea and
                                    buffet lunch
                                  </div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">Local taxes</div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">
                                    Hotel pickup and drop-off by air-conditioned
                                    minivan
                                  </div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">
                                    InsuranceTransfer to a private pier
                                  </div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">Soft drinks</div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">Tour Guide</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="row y-gap-20">
                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">Towel</div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">Tips</div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="d-flex items-center">
                                  <div className="form-checkbox ">
                                    <input type="checkbox" name="name" />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon">
                                        <svg
                                          width="10"
                                          height="8"
                                          viewBox="0 0 10 8"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lh-16 ml-15">
                                    Alcoholic Beverages
                                  </div>
                                </div>
                              </div>
                            </div>
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
              © Copyright Viatours {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
