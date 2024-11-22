import React, { useState, useEffect } from 'react';
import LocationMap from '../common/MapComponent';
import { Form, Input, Button, Select, Checkbox, InputNumber, message } from 'antd';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {createActivity, updateActivity} from '../../api/ActivityService'
import ActivityCategoryService from '../../api/ActivityCategoryService'
import {getTags} from '../../api/PreferenceTagService'
const { TextArea } = Input;

const ActivityForm = ({ isUpdate }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const existingActivity = location.state?.activity;
  const [activityData, setActivityData] = useState({
    advertiser: existingActivity?.advertiser._id , // Use optional chaining here as well
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
    <div class="dashboard__content_content" style={{ backgroundColor: '#f0f0f0' }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 class="text-30">Activity Management</h1>
      </div>
      <div class="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:pb-20 mt-60 md:mt-30">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '10px' }}
        >
          <Form.Item label="Title" required>
            <Input
              value={activityData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter activity title"
              required
            />
          </Form.Item>

          <Form.Item label="Description" required>
            <TextArea
              value={activityData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter activity description"
              required
            />
          </Form.Item>

          <Form.Item label="Date" required>
            <input
              type="date"
              name="date"
              value={activityData.date}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Sets minimum date to today
              required
            />
          </Form.Item>

          <Form.Item label="Time" required>
            <input
              type="time"
              name="time"
              value={activityData.time}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              required
            />
          </Form.Item>


          <Form.Item label="Price" required>
            <InputNumber
              value={activityData.price}
              onChange={(value) => handleChange('price', value)}
              min={0}
              style={{ width: '100%' }}
              required
            />
          </Form.Item>

          <Form.Item label="Category" required>
            <Select
              value={activityData.category}
              onChange={(value) => handleChange('category', value)}
              placeholder="Select category"
              required
            >

              {categories?.map((category) => (
                <Select.Option key={category._id} value={isUpdate ? category.Name : category._id}>
                  {category.Name}
                </Select.Option>
              ))}

            </Select>
          </Form.Item>

          <Form.Item label="Tags" required>
            <Select
              mode="multiple"
              value={activityData.tags}
              onChange={handleTagChange}
              placeholder="Select tags"
            >
              {tags.map((tag) => (
                <Select.Option key={tag._id} value={tag._id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Special Discounts">
            <Input
              value={activityData.specialDiscounts}
              onChange={(e) => handleChange('specialDiscounts', e.target.value)}
              placeholder="Enter special discounts (if any)"
            />
          </Form.Item>

          <Form.Item label="Booking Open">
            <Checkbox
              checked={activityData.isBookingOpen}
              onChange={(e) => handleChange('isBookingOpen', e.target.checked)}

            >
              Is Booking Open?
            </Checkbox>
          </Form.Item>

          {/* Map Component */}
          <Form.Item label="Location (click on map to select)">
            <LocationMap
              markerPosition={markerPosition}
              setMarkerPosition={setMarkerPosition}
              setSelectedLocation={setSelectedLocation}

            />
            <div style={{ marginTop: '10px' }}>
              <strong>Selected Location:</strong> {selectedLocation || 'No location selected yet'}
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block
            >
              Submit Activity
            </Button>

          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ActivityForm;
