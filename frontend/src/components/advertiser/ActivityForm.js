import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActivityForm = () => {
  const [activityData, setActivityData] = useState({
    advertiser: '66fdd5beb6a46aa09c57e0d9',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    category: '',
    tags: [],
    specialDiscounts: '',
    isBookingOpen: false
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/activityCategories');
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/pref-tags');
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setActivityData({
      ...activityData,
      price: Number(activityData.price),
      [name]: type === 'checkbox' ? checked : value
    });
    console.log(activityData)
  };

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
    setActivityData({ ...activityData, tags: selectedTags });
  };

  const handleSubmit = async (e) => {
    debugger
    e.preventDefault();
    try {
      
      const response = await axios.post('http://localhost:5050/api/activities', activityData);
      console.log("Activity created:", response.data);
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input type="text" name="title" value={activityData.title} onChange={handleChange} required />
      </div>

      <div>
        <label>Description:</label>
        <textarea name="description" value={activityData.description} onChange={handleChange} required />
      </div>

      <div>
        <label>Date:</label>
        <input type="date" name="date" value={activityData.date} onChange={handleChange} required />
      </div>

      <div>
        <label>Time:</label>
        <input type="time" name="time" value={activityData.time} onChange={handleChange} required />
      </div>

      <div>
        <label>Location:</label>
        <input type="text" name="location" value={activityData.location} onChange={handleChange} required />
      </div>

      <div>
        <label>Price:</label>
        <input type="number" name="price" value={activityData.price} onChange={handleChange} required />
      </div>

      <div>
        <label>Category:</label>
        <select name="category" value={activityData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.Name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Tags:</label>
        <select name="tags" multiple onChange={handleTagChange} required>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Special Discounts:</label>
        <input type="text" name="specialDiscounts" value={activityData.specialDiscounts} onChange={handleChange} />
      </div>

      <div>
        <label>Booking Open:</label>
        <input type="checkbox" name="isBookingOpen" checked={activityData.isBookingOpen} onChange={handleChange} />
      </div>

      <button type="submit">Create Activity</button>
    </form>
  );
};

export default ActivityForm;