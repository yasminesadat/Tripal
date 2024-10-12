import React, { useState, useEffect } from "react";
import ActivityCategoryService from '../../api/ActivityCategoryService'

const ActivityFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ActivityCategoryService.getActivityCategories();
        setCategories(response);
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    onFilter({ startDate, endDate, budgetMin, budgetMax, category, rating });
  };

  return (
    <form id="activity-filter" onSubmit={handleFilter}>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <label>Min Price:</label>
        <input
          type="number"
          value={budgetMin}
          onChange={(e) => setBudgetMin(e.target.value)}
        />
      </div>
      <div>
        <label>Max Price:</label>
        <input
          type="number"
          value={budgetMax}
          onChange={(e) => setBudgetMax(e.target.value)}
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select A Category</option>
          {categories && categories.map((cat) => (
            <option key={cat._id} value={cat.Name}>
              {cat.Name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Min Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>
      <button type="submit">Filter</button>
    </form>
  );
};

export default ActivityFilter;
