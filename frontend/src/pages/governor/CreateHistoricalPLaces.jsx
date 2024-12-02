
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Upload, Select, TimePicker, Input, InputNumber, Button } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { getAllPeriodTags } from '../../api/HistoricalPlacePeriodService';
import { getAllTypeTags } from '../../api/HistoricalPlaceTagService';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import LocationMap from '../../components/common/MapComponent';
import message from "antd";
import { useNavigate } from "react-router-dom";
import { CreateNewHistoricalPlace, updateHistoricalPlace } from '../../api/HistoricalPlaceService';
const tabs = ["Content", "Timings", "Location", "Pricing"];
export default function AddHistoricalPlace() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");
  const location = useLocation();
  const props = location.state?.historicalPlace;
  const navigate = useNavigate();
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
      console.log(formData);
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
          navigate(`/my-historical-places`);
         message.success("Created Successfully");
        }
      }
      catch (err) {
        message.error("Error while creating");
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
              openingTime: (formData.openingHours.weekdays.openingTime).format("HH:mm"),
              closingTime: (formData.openingHours.weekdays.closingTime).format("HH:mm"),

            },
            weekends: {
              openingTime: (formData.openingHours.weekends.openingTime).format("HH:mm"),
              closingTime: (formData.openingHours.weekends.closingTime).format("HH:mm"),
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
      // historicalPeriod: [...formData.historicalPeriod.map((period) => ({
      //   label: period.name,
      //   value: period._id
      // }))],
      // tags: [...formData.tags.map((tag) => ({
      //   label: tag.name,
      //   value: tag._id
      // }))],
      weekendOpeningTime: formData.openingHours.weekends.openingTime ? moment(formData.openingHours.weekends.openingTime, "HH:mm") : null,
      weekendClosingTime: formData.openingHours?.weekends?.closingTime
        ? moment(formData.openingHours.weekends.closingTime, 'HH:mm')
        : null,
      weekdayOpeningTime: formData.openingHours.weekdays.openingTime ? moment(formData.openingHours.weekdays.openingTime, "HH:mm") : null,
      weekdayClosingTime: formData.openingHours?.weekdays?.closingTime
        ? moment(formData.openingHours.weekdays.closingTime, 'HH:mm')
        : null,
        foreignerPrice: formData.ticketPrices.foreigner,
        nativePrice: formData.ticketPrices.native,
        studentPrice:formData.ticketPrices.student,
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
                      <Form className=" row y-gap-30"
                        form={form}
                        layout="vertical"
                        name="validate_other"
                        onFinish={() => {
                          handleSubmission()
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
                          }))],
                          weekendOpeningTime: formData.openingHours.weekends.openingTime ? moment(formData.openingHours.weekends.openingTime, "HH:mm") : null,
                          weekendClosingTime: formData.openingHours.weekends.closingTime ? moment(formData.openingHours.weekends.closingTime, "HH:mm") : null,
                          weekdayOpeningTime: formData.openingHours.weekdays.openingTime ? moment(formData.openingHours.weekdays.openingTime, "HH:mm") : null,
                          weekdayClosingTime: formData.openingHours?.weekdays?.closingTime
                            ? moment(formData.openingHours.weekdays.closingTime, 'HH:mm')
                            : null,
                          foreignerPrice: formData.ticketPrices.foreigner,
                          nativePrice: formData.ticketPrices.native,
                          studentPrice:formData.ticketPrices.student,


                        }}
                        onValuesChange={(changedValues, allValues) => {
                          setFormData({
                            ...formData,
                            name: allValues.name,
                            description: allValues.description,
                            // historicalPeriod: allValues.historicalPeriod.map((tagValue) => {
                            //   const period = periodTagsOptions.find((p) => p._id === tagValue);
                            //   return {
                            //     name: period ? period.name : tagValue,
                            //     _id: period ? period._id : ''
                            //   };
                            // }),
                            // tags: allValues.tags.map((tagValue) => {
                            //   const tag = tagsOptions.find((p) => p._id === tagValue);
                            //   return {
                            //     name: tag ? tag.name : tagValue,
                            //     _id: tag ? tag._id : ''
                            //   };
                            //}),
                            openingHours: {
                              weekdays: {
                                openingTime: allValues.weekdayOpeningTime ? moment(allValues.weekdayOpeningTime, "HH:mm") : null,
                                closingTime: allValues.weekdayClosingTime ? moment(allValues.weekdayClosingTime, "HH:mm") : null,
                              },
                              weekends: {
                                openingTime: allValues.weekendOpeningTime ? moment(allValues.weekendOpeningTime, "HH:mm") : null,
                                closingTime: allValues.weekendClosingTime ? moment(allValues.weekendClosingTime, "HH:mm") : null,
                              }
                            },
                            ticketPrices: {
                              foreigner: allValues.foreignerPrice,
                               native:allValues.nativePrice,
                              student: allValues.studentPrice,
                            },

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
                        <div
                          className={`tabs__pane  ${activeTab == "Content" ? "is-tab-el-active" : ""
                            }`}
                        >

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
                              <Input
                                type="text"
                                style={{
                                  width: '100%',
                                  height: '50px', // Adjust the height as needed
                                  padding: '10px 15px', // Increase padding for taller appearance
                                  fontSize: '18px', // Increase font size for better readability
                                  border: '1px solid #ccc',
                                  borderRadius: '10px', // Optional for a rounded look
                                }}
                              />
                            </Form.Item>
                          </div>

                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Description
                            </label>
                            <Form.Item

                              name="description"
                              rules={[
                                {
                                  required: id === undefined,
                                  message: 'Please enter the place description!',
                                },
                              ]}>

                              <Input.TextArea style={{
                                width: '100%',
                                height: '50px', // Adjust the height as needed
                                padding: '10px 15px', // Increase padding for taller appearance
                                fontSize: '18px', // Increase font size for better readability
                                border: '1px solid #ccc',
                                borderRadius: '10px', // Optional for a rounded look
                              }}
                                type="text"
                              />

                            </Form.Item>
                          </div>
                          <div className="col-12">
                            <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                              Historical Periods
                            </label>
                            <Form.Item
                              name="historicalPeriod"
                              rules={[{ required: false, message: "Please select or create historical periods" }]}>
                              <Select
                                mode="tags"
                                placeholder="Please select or create period tags"
                                // defaultValue={[...formData.historicalPeriod.map((period) => ({
                                //     label: period.name,
                                //     value: period._id
                                // }))]}
                                style={{
                                  width: '100%',
                                  height: '50px', // Adjust the height as needed
                                  // Increase padding for taller appearance
                                  fontSize: '18px', // Increase font size for better readability
                                  border: '1px solid #ccc',
                                  borderRadius: '10px', // Optional for a rounded look
                                }}
                                onChange={(selectedTags) => {
                                  const selectedPeriods = selectedTags.map((tagValue) => {
                                    const period = periodTagsOptions.find((p) => p._id === tagValue);
                                    return {
                                      name: period ? period.name : tagValue,
                                      _id: period ? period._id : ''
                                    };
                                  });
                                  console.log(selectedPeriods);
                                  setFormData((data) => ({
                                    ...data,
                                    historicalPeriod: selectedPeriods,
                                  }));
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
                            <Form.Item
                              name="tags"
                              rules={[{ required: false, message: "Please select or create tags" }]}>
                              <Select
                                mode="tags"
                                placeholder="Please select or new tags"
                                // defaultValue={[...formData.tags.map((tag) => ({
                                //     label: tag.name,
                                //     value: tag._id
                                // }))]}
                                style={{
                                  width: '100%',
                                  height: '50px', // Adjust the height as needed
                                  // Increase padding for taller appearance
                                  fontSize: '18px', // Increase font size for better readability
                                  border: '1px solid #ccc',
                                  borderRadius: '10px', // Optional for a rounded look
                                }}
                                onChange={(selectedTags) => {
                                  console.log("helo", selectedTags);
                                  const tags = selectedTags.map((tagValue) => {
                                    const tag = tagsOptions.find((p) => p._id === tagValue);
                                    return {
                                      name: tag ? tag.name : tagValue,
                                      _id: tag ? tag._id : ''
                                    };
                                  });
                                  console.log(tags);
                                  setFormData((data) => ({
                                    ...data,
                                    tags: tags,
                                  }));
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
                                listType="picture"
                                style={{
                                  width: '100%',
                                  height: '50px', // Adjust the height as needed
                                  padding: '10px 15px', // Increase padding for taller appearance
                                  fontSize: '18px', // Increase font size for better readability
                                  border: '1px solid #ccc',
                                  borderRadius: '10px', // Optional for a rounded look
                                }}
                              >
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
                            <Button className="button -md -dark-1 bg-accent-1 text-white"
                              onClick={() => {
                                setActiveTab("Timings")
                              }}>
                              Next
                              <i className="icon-arrow-top-right text-16 ml-10"></i>
                            </Button>
                          </div>
                        </div>
                        <div
                          className={`tabs__pane  ${activeTab == "Timings" ? "is-tab-el-active" : ""
                            }`}
                        >
                          <div className=" row y-gap-30">
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
                                <TimePicker
                                  style={{
                                    width: '100%',
                                    height: '50px', // Adjust the height as needed
                                    padding: '10px 15px', // Increase padding for taller appearance
                                    fontSize: '18px', // Increase font size for better readability
                                    border: '1px solid #ccc',
                                    borderRadius: '10px', // Optional for a rounded look
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
                                <TimePicker
                                  style={{
                                    width: '100%',
                                    height: '50px', // Adjust the height as needed
                                    padding: '10px 15px', // Increase padding for taller appearance
                                    fontSize: '18px', // Increase font size for better readability
                                    border: '1px solid #ccc',
                                    borderRadius: '10px', // Optional for a rounded look
                                  }}
                                  placeholder="please select the weekends closing time" />
                              </Form.Item>

                            </div>
                            <div className="col-12">
                              <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                                Weekdays Opening Time
                              </label>

                              <Form.Item className="form-input " name="weekdayOpeningTime" rules={[
                                {
                                  type: 'object',
                                  required: id === undefined,
                                  message: 'Please select weekdays opening time!',
                                },
                              ]}>
                                <TimePicker
                                  style={{
                                    width: '100%',
                                    height: '50px', // Adjust the height as needed
                                    padding: '10px 15px', // Increase padding for taller appearance
                                    fontSize: '18px', // Increase font size for better readability
                                    border: '1px solid #ccc',
                                    borderRadius: '10px', // Optional for a rounded look
                                  }}
                                  placeholder="please select the weekdays opening time" />
                              </Form.Item>
                            </div>

                            <div className="col-12">
                              <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                                Weekdays Closing Time
                              </label>

                              <Form.Item className="form-input " name="weekdayClosingTime" rules={[
                                {
                                  type: 'object',
                                  required: id === undefined,
                                  message: 'Please select weekdays closing time!',
                                },
                              ]}>
                                <TimePicker
                                  style={{
                                    width: '100%',
                                    height: '50px', // Adjust the height as needed
                                    padding: '10px 15px', // Increase padding for taller appearance
                                    fontSize: '18px', // Increase font size for better readability
                                    border: '1px solid #ccc',
                                    borderRadius: '10px', // Optional for a rounded look
                                  }}
                                  placeholder="please select the weekdays closing time" />
                              </Form.Item>

                            </div>

                            <div className="col-12">
                              <Button className="button -md -dark-1 bg-accent-1 text-white mt-30" onClick={() => {
                                setActiveTab("Location")
                              }}>
                                Next
                                <i className="icon-arrow-top-right text-16 ml-10"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`tabs__pane  ${activeTab == "Location" ? "is-tab-el-active" : ""
                            }`}
                        >
                          <div className=" row y-gap-30">
                            <div className="col-12" >
                              <h2 style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                                Historical Place Location
                              </h2>
                              <div className="map relative mt-20">
                                <LocationMap
                                  markerPosition={coordinates}
                                  setMarkerPosition={setCoordinates}
                                  setSelectedLocation={setAddress}
                                />
                              </div>
                            </div>

                            <div className="col-12" >
                              <strong>Selected Location:</strong> {address || 'No location selected yet'}
                            </div>
                            <div className="col-12" >
                              <Button className="button -md -dark-1 bg-accent-1 text-white mt-30" onClick={() => {
                                setActiveTab("Pricing")
                              }}>
                                Next
                                <i className="icon-arrow-top-right text-16 ml-10"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`tabs__pane  ${activeTab == "Pricing" ? "is-tab-el-active" : ""
                            }`}
                        >
                          <div className=" row y-gap-30">
                            <div className="col-12">
                              <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                                Foreigner Ticket Price
                              </label>
                              <Form.Item
                                name="foreignerPrice"
                                rules={[{ required: id === undefined, message: "Please enter the foreigner ticket price" }]}
                              >
                                <InputNumber
                                  min={0}
                                  placeholder="Enter foreigner ticket price"
                                  style={{
                                    width: '100%',
                                    height: '50px', // Adjust the height as needed
                                    padding: '10px 15px', // Increase padding for taller appearance
                                    fontSize: '18px', // Increase font size for better readability
                                    border: '1px solid #ccc',
                                    borderRadius: '10px', // Optional for a rounded look
                                  }}
                                />
                              </Form.Item>

                            </div>
                            <div className="col-12">
                              <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                                Native Ticket Price
                              </label>
                              <Form.Item
                                name="nativePrice"
                                rules={[{ required: id === undefined, message: "Please enter the native ticket price" }]}
                              >
                                <InputNumber
                                  min={0}
                                  style={{
                                    width: '100%',
                                    height: '50px', // Adjust the height as needed
                                    padding: '10px 15px', // Increase padding for taller appearance
                                    fontSize: '18px', // Increase font size for better readability
                                    border: '1px solid #ccc',
                                    borderRadius: '10px', // Optional for a rounded look
                                  }}
                                  placeholder="Enter native ticket price"
                                  
                                />
                              </Form.Item>
                            </div>
                            <div className="col-12">
                              <label style={{ color: 'black', marginBottom: '10px', }} className="lh-1 text-16 text-light-1">
                                Student Ticket Price
                              </label>
                              <Form.Item
                                name="studentPrice"
                                rules={[{ required: id === undefined, message: "Please enter the student ticket price" }]}
                              >
                                <InputNumber
                                  min={0}
                                  placeholder="Enter student ticket price"
                                  style={{
                                    width: '100%',
                                    height: '50px', // Adjust the height as needed
                                    padding: '10px 15px', // Increase padding for taller appearance
                                    fontSize: '18px', // Increase font size for better readability
                                    border: '1px solid #ccc',
                                    borderRadius: '10px', // Optional for a rounded look
                                  }}
                                />
                              </Form.Item>

                            </div>
                            <div className="col-12">
                              <Button className="button -md -dark-1 bg-accent-1 text-white mt-30" htmlType="submit" loading={loading} type="primary">
                                {id === undefined ? "Create" : "Update"}
                                <i className="icon-arrow-top-right text-16 ml-10"></i>
                              </Button>
                            </div></div>
                        </div>
                      </Form>
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
