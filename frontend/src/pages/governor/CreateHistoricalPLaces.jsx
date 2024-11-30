// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import Map from "../pages/contact/Map";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Form, Upload, Select, TimePicker, Input, InputNumber, Button } from "antd";
import { InboxOutlined } from '@ant-design/icons';
// import MapPopUp from "../../components/common/MapPopUp";
import { getAllPeriodTags } from '../../api/HistoricalPlacePeriodService';
import { getAllTypeTags } from '../../api/HistoricalPlaceTagService';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
// import { toast } from "react-toastify";
import { CreateNewHistoricalPlace, updateHistoricalPlace } from '../../api/HistoricalPlaceService';
const tabs = ["Content", "Timings", "Location", "Pricing", "Included"];
export default function AddHistoricalPlace() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("/img/dashboard/addtour/1.jpg");
  const [image3, setImage3] = useState("/img/dashboard/addtour/2.jpg");
  const [image4, setImage4] = useState("/img/dashboard/addtour/3.jpg");
  const location = useLocation();
  const props = location.state?.place;
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
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
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
          // toast.success('Historical place created successfully')
        }
      }
      catch (err) {
        // toast.error(err);
        setLoading(false);
      }
    }
    else {
      try {
        const updatedHistoricalPlace = {
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
          // toast.success('Historical place Updated successfully')
        }

      } catch (err) {
        // toast.error(err);
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
  useEffect(() => {
    form.setFieldsValue({
      name: formData.name,
      description: formData.description,
      historicalPeriod: [...formData.historicalPeriod.map((period) => ({
        label: period.name,
        value: period._id
      }))],
      tags: [...formData.tags.map((tag) => ({
        label: tag.name,
        value: tag._id
      }))],
      weekendOpeningTime: formData.openingHours.weekends.openingTime ? moment(formData.openingHours.weekends.openingTime, "HH:mm") : null,
      weekendClosingTime: formData.openingHours?.weekends?.closingTime
        ? moment(formData.openingHours.weekends.closingTime, 'HH:mm')
        : null,
      weekdayOpeningTime:formData.openingHours.weekdays.openingTime ? moment(formData.openingHours.weekdays.openingTime, "HH:mm") : null,
      weekdayClosingTime:formData.openingHours?.weekdays?.closingTime
      ? moment(formData.openingHours.weekdays.closingTime, 'HH:mm')
      : null
    });
  }, [formData, form]);

  return (
    <>

      <div
        className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""
          } js-dashboard`}
      >
        {/* <Sidebar setSideBarOpen={setSideBarOpen} /> */}

        <div className="dashboard__content">
          {/* <Header setSideBarOpen={setSideBarOpen} /> */}

          <div className="dashboard__content_content">

            {id === undefined && <h1 className="text-30">Add Historical Place</h1>}
            {id !== undefined && <h1 className="text-30">Update Historical Place</h1>}
            {/* // <p className="">Lorem ipsum dolor sit amet, consectetur.</p> */}

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
                        className={`tabs__pane  ${activeTab == "Content" ? "is-tab-el-active" : ""
                          }`}
                      >
                        <Form className="contactForm row y-gap-30"
                          form={form}
                          layout="vertical"
                          name="validate_other"
                          onFinish={() => {
                            setActiveTab("Timings");
                            console.log("hello");
                          }
                          }
                          initialValues={{
                            upload: fileList,
                            name: formData.name,
                            description: formData.description,
                            historicalPeriod: [...formData.historicalPeriod.map((period) => ({
                              label: period.name,
                              value: period._id
                            }))],
                            tags: [...formData.tags.map((tag) => ({
                              label: tag.name,
                              value: tag._id
                            }))]
                          }}
                          onValuesChange={(changedValues, allValues) => {
                            setFormData({
                              ...formData,
                              name: allValues.name,
                              description: allValues.description,
                              historicalPeriod: allValues.historicalPeriod.map((tagValue) => {
                                const period = periodTagsOptions.find((p) => p._id === tagValue);
                                return {
                                  name: period ? period.name : tagValue,
                                  _id: period ? period._id : ''
                                };
                              }),
                              tags: allValues.tags.map((tagValue) => {
                                const tag = tagsOptions.find((p) => p._id === tagValue);
                                return {
                                  name: tag ? tag.name : tagValue,
                                  _id: tag ? tag._id : ''
                                };
                              }),
                            });
                          }}


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
          pointer-events: none;
        }
        .contactForm .form-input input:focus + label,
        .contactForm .form-input textarea:focus + label,
        .contactForm .form-input input:not(:placeholder-shown) + label,
        .contactForm .form-input textarea:not(:placeholder-shown) + label {
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
          background: #fff;
        }
        `}
                          </style>
                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Name
                            </label>
                            <Form.Item className="form-input "
                              name="name"
                              rules={[
                                {
                                  required: id === undefined,
                                  message: 'Please enter the place name!',
                                },
                              ]}
                            >
                              <Input style={{
                                width: '100%',
                              }}
                                type="text"
                              />
                            </Form.Item>
                          </div>

                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Description
                            </label>
                            <Form.Item className="form-input "

                              name="description"
                              rules={[
                                {
                                  required: id === undefined,
                                  message: 'Please enter the place description!',
                                },
                              ]}>

                              <Input.TextArea style={{
                                width: '100%',
                              }}
                                type="text"
                              />

                            </Form.Item>
                          </div>
                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Historical Periods
                            </label>
                            <Form.Item className="form-input "
                              name="historicalPeriod"
                              rules={[{ required: false, message: "Please select or create historical periods" }]}>
                              <Select
                                mode="tags"
                                placeholder="Please select or create period tags"
                                style={{
                                  width: '100%',
                                }}
                                options={periodTagsOptions.map((period) => (
                                  {
                                    label: period.name,
                                    value: period._id
                                  }
                                )
                                )}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Tags
                            </label>
                            <Form.Item className="form-input "
                              name="tags"
                              rules={[{ required: false, message: "Please select or create tags" }]}>
                              <Select
                                mode="tags"
                                placeholder="Please select or new tags"
                                style={{
                                  width: '100%',
                                }}
                                options={tagsOptions.map((tag) => (
                                  {
                                    label: tag.name,
                                    value: tag._id,
                                  }
                                )
                                )}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-12">
                            <label style={{
                              color: 'black',
                              marginBottom: '10px',
                            }} className="lh-1 text-16 text-light-1">
                              Upload Place Images
                            </label>
                            <Form.Item
                              name="upload"
                              valuePropName="fileList"
                              getValueFromEvent={normFile}
                              extra="You can select one or more images"
                            >
                              <Upload.Dragger
                                multiple
                                onChange={handleChoosingImage}
                                onRemove={(file) => {
                                  console.log("the file to be removed", file);
                                  if ('url' in file) {
                                    setDeletedImages((oldImages) => new Set([...oldImages]).add({
                                      public_id: file.uid,
                                      url: file.url,
                                    }))
                                    console.log("deleted images set", deletedImages)
                                  } else {
                                    setNewImages((oldData) => {
                                      const reader = new FileReader();
                                      reader.readAsDataURL(file.originFileObj);
                                      reader.onloadend = () => {
                                        const encodedImage = reader.result;
                                        return new Set([...oldData].filter((image) => image !== encodedImage))
                                      }
                                    });
                                    console.log("the new images set", newImages)
                                  }
                                }}
                                listType="picture">
                                <p >
                                  <InboxOutlined />
                                </p>
                                <p >Click or drag files to this area to upload</p>
                                <p >
                                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.
                                </p>
                              </Upload.Dragger>

                            </Form.Item>
                          </div>

                          <div className="col-12">
                            <Button className="button -md -dark-1 bg-accent-1 text-white" type="primary"
                              htmlType="submit">
                              Next
                              <i className="icon-arrow-top-right text-16 ml-10"></i>
                            </Button>
                          </div>
                        </Form>
                      </div>
                      <div
                        className={`tabs__pane  ${activeTab == "Timings" ? "is-tab-el-active" : ""
                          }`}
                      >
                        <Form className="contactForm row y-gap-30"
                          form={form}
                          layout="vertical"
                          name="timing"
                          onFinish={() => {
                            setActiveTab("Location");
                            console.log("hello");
                          }
                          }
                          initialValues={{
                            weekendOpeningTime: formData.openingHours.weekends.openingTime ? moment(formData.openingHours.weekends.openingTime, "HH:mm") : null,
                            weekendClosingTime: formData.openingHours.weekends.closingTime ? moment(formData.openingHours.weekends.closingTime, "HH:mm") : null,
                            weekdayOpeningTime:formData.openingHours.weekdays.openingTime ? moment(formData.openingHours.weekdays.openingTime, "HH:mm") : null,
                            weekdayClosingTime:formData.openingHours?.weekdays?.closingTime
                              ? moment(formData.openingHours.weekdays.closingTime, 'HH:mm')
                              : null
                          }}
                          onValuesChange={(changedValues, allValues) => {
                            console.log(allValues)
                            setFormData({
                              ...formData,
                              openingHours: {
                                weekdays: {
                                  openingTime: allValues.weekendClosingTime ? moment(allValues.weekendClosingTime, "HH:mm") : null,
                                  closingTime: allValues.weekdayClosingTime ? moment(allValues.weekdayClosingTime, "HH:mm") : null,
                                },
                                weekends: {
                                  openingTime: allValues.weekendOpeningTime ? moment(allValues.weekendOpeningTime, "HH:mm") : null,
                                  closingTime: allValues.weekendClosingTime ? moment(allValues.weekendClosingTime, "HH:mm") : null,
                                }
                              }

                            });
                          }}
                       
                        >
                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Weekends Opening Time
                            </label>
                            <Form.Item className="form-input " name="weekendOpeningTime" rules={[
                              {
                                type: 'object',
                                required: id === undefined,
                                message: 'Please select weekends opening time!',
                              },
                            ]}>
                              <TimePicker style={{
                                width: '100%',
                              }}
                                placeholder="please select the weekends opening time" />

                            </Form.Item>
                          </div>

                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Weekends Closing Time
                            </label>
                            <Form.Item className="form-input " name="weekendClosingTime" rules={[
                              {
                                type: 'object',
                                required: id === undefined,
                                message: 'Please select weekends closing time!',
                              },
                            ]}>
                              <TimePicker style={{
                                width: '100%',
                              }}

                                placeholder="please select the weekends closing time" />
                            </Form.Item>

                          </div>
                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Weekdays Opening Time
                            </label>

                            <Form.Item className="form-input " name="weekdayOpeningTime" label="Weekdays opening time" rules={[
                              {
                                type: 'object',
                                required: id === undefined,
                                message: 'Please select weekdays opening time!',
                              },
                            ]}>
                              <TimePicker style={{
                                width: '100%',
                              }} name="weekdayOpeningTime"
                                
                                
                                placeholder="please select the weekdays opening time" />
                            </Form.Item>
                          </div>

                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Weekdays Closing Time
                            </label>
                            
                            <Form.Item className="form-input " name="weekdayClosingTime"  rules={[
                    {
                        type: 'object',
                        required: id === undefined,
                        message: 'Please select weekdays closing time!',
                    },
                ]}>
                    <TimePicker style={{
                        width: '100%',
                    }} name="weekdayClosingTime"
                       
                        
                        placeholder="please select the weekdays closing time" />
                </Form.Item>

                            </div>
                          
                          <div className="col-12">
                            <Button className="button -md -dark-1 bg-accent-1 text-white mt-30">
                              Next
                              <i className="icon-arrow-top-right text-16 ml-10"></i>
                            </Button>
                          </div>
                        </Form>
                      </div>
                      <div
                        className={`tabs__pane  ${activeTab == "Location" ? "is-tab-el-active" : ""
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
                          {/* <Map /> */}
                        </div>

                        <button className="button -md -dark-1 bg-accent-1 text-white mt-30">
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>

                      <div
                        className={`tabs__pane  ${activeTab == "Pricing" ? "is-tab-el-active" : ""
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
                        className={`tabs__pane  ${activeTab == "Included" ? "is-tab-el-active" : ""
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
