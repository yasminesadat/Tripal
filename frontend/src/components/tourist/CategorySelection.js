import React, { useEffect, useState } from "react";
import ActivityCategoryService from "../../api/ActivityCategoryService";
import { updateTouristInformation } from "../../api/TouristService";
import { CloseOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

export default function CategorySelection() {
  const navigate = useNavigate(); 
  const { touristId } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ActivityCategoryService.getActivityCategories();
        const fetchedCategories = response; //NOT RESPONSE.DATA
        if (Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const removeCategory = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((id) => id !== categoryId)
    );
  };

  const handleNext = async () => {
    if (selectedCategories.length === 0) {
      message.error ("Please select at least one category before proceeding");
      
      return;
    }
    try {
      const body = { categories: selectedCategories };
      await updateTouristInformation(touristId, body);
      console.log("Categories saved successfully!");
      navigate("/tourist");
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  const handleSkip = () => {
    navigate("/tourist");
  };

  return (
    <section className="mt-header layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="text-center mb-lg">
              <h1 className="text-30">What categories of activities do you prefer?</h1>
            </div>
            <div className="selected-categories mb-lg">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((cat) => cat._id === categoryId);
                return (
                  category && (
                    <div key={category._id} className="selected-category">
                      <span> {category.Name}</span>
                      <CloseOutlined onClick={() => removeCategory(category._id)} />
                    </div>
                  )
                );
              })}
            </div>

            <div className="category-tags mb-lg border-1 rounded-12 px-20 py-20">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category._id}
                    className={`tag-item ${selectedCategories.includes(category._id) ? "selected" : ""}`}
                    onClick={() => handleCategoryChange(category._id)}
                  >
                    <span> {category.Name}</span>
                  </div>
                ))
              ) : (
                <p>No categories available</p>
              )}
            </div>
            <br></br>
            <button onClick={handleNext} className="button -md -dark-1 bg-accent-1 text-white col-12 mt-lg">
              Next
              <i className="icon-arrow-top-right ml-10"></i>
            </button>

            <button 
              onClick={handleSkip} 
              className="skip-button col-12 mt-2" 
              style={{ color: 'rgba(0, 0, 0, 0.4)', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              Skip
            </button>
            </div>
          </div>
        </div>
    
    </section>
  );
}
