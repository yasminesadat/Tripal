import React, { useState, useEffect } from 'react';
import LocationMap from '../common/MapComponent';
import { Form, Input, Button, Select, Checkbox, InputNumber, message } from 'antd';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createActivity, updateActivity } from '../../api/ActivityService'
import ActivityCategoryService from '../../api/ActivityCategoryService'
import { getTags } from '../../api/PreferenceTagService'
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import AdvertiserHeader from '../layout/header/AdvertiserHeader';
import FooterThree from '../layout/footers/FooterThree';
const { TextArea } = Input;

const ActivityForm = ({ isUpdate }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const existingActivity = location.state?.activity;
  const [activityData, setActivityData] = useState({
    advertiser: existingActivity?.advertiser._id, // Use optional chaining here as well
    title: existingActivity?.title || '',
    description: existingActivity?.description || '',
    date: existingActivity?.date ? new Date(existingActivity.date).toISOString().split('T')[0] : '',
    time: existingActivity?.time || '',
    price: existingActivity?.price || 0,
    category: existingActivity?.category?.Name || '',
    tags: existingActivity?.tags ? existingActivity.tags.map(tag => tag._id) : [],
    specialDiscounts: existingActivity?.specialDiscounts || '',
    isBookingOpen: existingActivity?.isBookingOpen || false,
    location: existingActivity?.location || 'No location selected yet',
  });



  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]); // Default position (London)
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await ActivityCategoryService.getActivityCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await getTags();
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };


    fetchCategories();
    fetchTags();

    if (isUpdate && existingActivity) {
      setSelectedLocation(existingActivity.location || 'No location selected yet');
      setMarkerPosition([
        existingActivity.latitude || 51.505, // Default to London's latitude if not available
        existingActivity.longitude || -0.09 // Default to London's longitude if not available
      ]);
    }


  }, []);

  const handleChange = (name, value) => {
    console.log("change in from to ", name, value)
    console.log("categories", categories)
    setActivityData({
      ...activityData,
      [name]: value,
    });
  };

  const handleTagChange = (value) => {
    setActivityData({ ...activityData, tags: value });
    console.log("new tags are", value);
  };

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        console.log("print activityData", activityData)
        const response = await updateActivity(id, {
          ...activityData,
          location: selectedLocation, // Store the location string
          latitude: markerPosition[0], // Send the latitude
          longitude: markerPosition[1], // Send the longitude
        });
        message.success('Activity updated successfully!');
        setTimeout(() => navigate(`/advertiser/activities`), 1000);
      }
      else {
        console.log(activityData.advertiser)
        const response = await createActivity({
          ...activityData,
          location: selectedLocation, // Store the location string
          latitude: markerPosition[0], // Send the latitude
          longitude: markerPosition[1], // Send the longitude
        });

        message.success('Activity created successfully!');
        console.log('Activity created:', response.data);
        setTimeout(() => navigate(`/advertiser/activities`), 1000);
      }
    } catch (error) {
      console.error('Error creating ACTIVITY:', error);
      message.error('Failed to save activity.');
    }
  };

  return (
    <div>
      {isUpdate && <AdvertiserHeader />}

      <main className="page-content-hana">
        <div className="dashboard__content" style={{ minHeight: '100vh' }}>
          <MDBContainer fluid>
            <MDBRow className="h-100">
              {/* Left Column - Hero Section */}
              <MDBCol md="4" style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #036264 0%, #11302a 100%)',
                padding: '2rem'
              }}>
                <div className="sticky-top pt-5" style={{ top: '20px', marginTop: '3rem' }}>
                  <div className="text-center mb-5">
                    <img
                      src="/img/hero/3/1.png"
                      alt="hero"
                      className="img-fluid mb-4"
                      style={{ maxWidth: '80%' }}
                    />
                    <h2 className="display-6 fw-bold mb-3" style={{ color: '#e5f8f8' }}>
                      {isUpdate && existingActivity ? 'Update Activity' : 'Create Activity'}
                    </h2>
                    <p style={{ color: '#dac4d0' }} className="lead">
                      Plan and manage memorable adventures for your customers
                    </p>
                  </div>
                  <div className="text-center mt-5">
                    <img
                      src="/img/hero/3/2.png"
                      alt="hero"
                      className="img-fluid"
                      style={{ maxWidth: '80%' }}
                    />
                  </div>
                </div>
              </MDBCol>

              {/* Right Column - Form */}
              <MDBCol md="8" className="p-4">
                <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                  <h1 className="h3 mb-4" style={{ color: '#036264' }}>Activity Management</h1>
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="activity-form"
                  >

                    <style>
                      {`
                    .activity-form .ant-form-item {
                      margin-bottom: 24px;
                    }

                    .activity-form .ant-input,
                    .activity-form .ant-input-number,
                    .activity-form .ant-select-selector,
                    .activity-form input[type="date"],
                    .activity-form input[type="time"] {
                      padding: 8px 12px;
                      border-radius: 8px;
                      border: 1px solid #dac4d0;
                      width: 100%;
                      min-height: 42px;
                      transition: all 0.3s ease;
                    }

                    .activity-form .ant-input:focus,
                    .activity-form .ant-input-number:focus,
                    .activity-form .ant-select-selector:focus,
                    .activity-form input[type="date"]:focus,
                    .activity-form input[type="time"]:focus {
                      border-color: #8f5774;
                      box-shadow: 0 0 0 2px rgba(143, 87, 116, 0.1);
                      outline: none;
                    }
.form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    color: #036264;
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
  }

  .custom-input,
  .custom-input-number,
  .custom-select .ant-select-selector,
  .custom-select-multiple .ant-select-selector {
    border: 1px solid #dac4d0 !important;
    border-radius: 8px !important;
    padding: 8px 12px !important;
    min-height: 42px !important;
    width: 100% !important;
    transition: all 0.3s ease !important;
  }

  .custom-input:focus,
  .custom-input-number:focus,
  .custom-select .ant-select-selector:focus,
  .custom-select-multiple .ant-select-selector:focus {
    border-color: #8f5774 !important;
    box-shadow: 0 0 0 2px rgba(143, 87, 116, 0.1) !important;
    outline: none !important;
  }

  .custom-select .ant-select-selection-item,
  .custom-select-multiple .ant-select-selection-item {
    color: #11302a;
  }

  .checkbox-group {
    padding: 0.5rem 0;
  }

  .custom-checkbox .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #036264;
    border-color: #036264;
  }

  .custom-checkbox .ant-checkbox-wrapper:hover .ant-checkbox-inner {
    border-color: #5a9ea0;
  }

  .map-container {
    border: 1px solid #dac4d0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .location-info {
    background: #e5f8f8;
    padding: 12px;
    border-radius: 6px;
    color: #036264;
    font-size: 14px;
  }

  /* Multiple Select Tag Styles */
  .ant-select-multiple .ant-select-selection-item {
    background: #e5f8f8;
    border-color: #036264;
    color: #036264;
  }

  .ant-select-multiple .ant-select-selection-item-remove {
    color: #036264;
  }

  /* InputNumber Specific Styles */
  .ant-input-number-handler-wrap {
    background: #f5f5f5;
    border-left: 1px solid #dac4d0;
  }

  .ant-input-number-handler:hover {
    background: #e5f8f8;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .form-group {
      margin-bottom: 1rem;
    }
    
    .custom-input,
    .custom-input-number,
    .custom-select .ant-select-selector,
    .custom-select-multiple .ant-select-selector {
      min-height: 38px !important;
    }
  }
                    .activity-form .ant-form-item-label > label {
                      font-weight: 500;
                      color: #036264;
                    }

                    .activity-form .ant-btn-primary {
                      height: 45px;
                      font-size: 16px;
                      background: #036264;
                      border: none;
                      border-radius: 8px;
                      margin-top: 16px;
                      transition: all 0.3s ease;
                    }

                    .activity-form .ant-btn-primary:hover {
                      background: #5a9ea0 !important;
                    }

                    .activity-form textarea.ant-input {
                      min-height: 120px;
                      resize: vertical;
                    }

                    .activity-form .ant-checkbox-checked .ant-checkbox-inner {
                      background-color: #036264 !important;
                      border-color: #036264 !important;
                    }

                    .activity-form .ant-select-selector:hover {
                      border-color: #8f5774;
                    }

                    .activity-form .ant-select-focused .ant-select-selector {
                      border-color: #8f5774 !important;
                      box-shadow: 0 0 0 2px rgba(143, 87, 116, 0.1) !important;
                    }

                    .activity-form .map-container {
                      border-radius: 8px;
                      overflow: hidden;
                      margin-top: 8px;
                      border: 1px solid #dac4d0;
                    }

                    .activity-form .selected-location {
                      margin-top: 12px;
                      padding: 12px;
                      background: #e5f8f8;
                      border-radius: 6px;
                      font-size: 14px;
                      color: #036264;
                    }

                    /* Custom styles for date and time inputs */
                    .activity-form input[type="date"],
                    .activity-form input[type="time"] {
                      color: #11302a;
                      background-color: white;
                    }

                    .activity-form input[type="date"]::-webkit-calendar-picker-indicator,
                    .activity-form input[type="time"]::-webkit-calendar-picker-indicator {
                      filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%);
                    }
                  `}
                    </style>

                    {/* Your existing form fields but with improved layout */}
                    <MDBRow>
                      <MDBCol md="12">
                        <Form.Item label="Title" required>
                          <Input
                            value={activityData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter activity title"
                          />
                        </Form.Item>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="12">
                        <Form.Item label="Description" required>
                          <TextArea
                            value={activityData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Enter activity description"
                            rows={4}
                          />
                        </Form.Item>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="6">
                        <Form.Item label="Date" required>
                          <input
                            type="date"
                            name="date"
                            value={activityData.date}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </Form.Item>
                      </MDBCol>
                      <MDBCol md="6">
                        <Form.Item label="Time" required>
                          <input
                            type="time"
                            name="time"
                            value={activityData.time}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                          />
                        </Form.Item>
                      </MDBCol>
                    </MDBRow>


                    <MDBRow>
                      <MDBCol md="6">
                        <Form.Item
                          label="Price"
                          required
                          className="form-group"
                        >
                          <InputNumber
                            value={activityData.price}
                            onChange={(value) => handleChange('price', value)}
                            min={0}
                            style={{ width: '100%' }}
                            required
                            className="custom-input-number"
                          />
                        </Form.Item>
                      </MDBCol>
                      <MDBCol md="6">
                        <Form.Item
                          label="Category"
                          required
                          className="form-group"
                        >
                          <Select
                            value={activityData.category}
                            onChange={(value) => handleChange('category', value)}
                            placeholder="Select category"
                            required
                            className="custom-select"
                          >
                            {categories?.map((category) => (
                              <Select.Option key={category._id} value={isUpdate ? category.Name : category._id}>
                                {category.Name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="12">
                        <Form.Item
                          label="Tags"
                          required
                          className="form-group"
                        >
                          <Select
                            mode="multiple"
                            value={activityData.tags}
                            onChange={handleTagChange}
                            placeholder="Select tags"
                            className="custom-select-multiple"
                          >
                            {tags.map((tag) => (
                              <Select.Option key={tag._id} value={tag._id}>
                                {tag.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="12">
                        <Form.Item
                          label="Special Discounts"
                          className="form-group"
                        >
                          <Input
                            value={activityData.specialDiscounts}
                            onChange={(e) => handleChange('specialDiscounts', e.target.value)}
                            placeholder="Enter special discounts (if any)"
                            className="custom-input"
                          />
                        </Form.Item>
                      </MDBCol>
                    </MDBRow>

                    <Form.Item label="Booking Open">                     <Checkbox checked={activityData.isBookingOpen} onChange={(e) => handleChange('isBookingOpen', e.target.checked)}                      >                       Is Booking Open?                     </Checkbox>                   </Form.Item>

                    <MDBRow>
                      <MDBCol md="12">
                        <Form.Item
                          label="Location (search for your desired location)"
                          className="form-group map-group"
                        >
                          <div className="map-container">
                            <LocationMap
                              markerPosition={markerPosition}
                              setMarkerPosition={setMarkerPosition}
                              setSelectedLocation={setSelectedLocation}
                            />
                          </div>
                          <div className="location-info">
                            <strong>Selected Location:</strong> {selectedLocation || 'No location selected yet'}
                          </div>
                        </Form.Item>
                      </MDBCol>
                    </MDBRow>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                      >
                        {isUpdate ? 'Update Activity' : 'Create Activity'}
                      </Button>

                    </Form.Item>
                  </Form>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </main>
      {isUpdate && <FooterThree />}
    </div>
  );
};

export default ActivityForm;
