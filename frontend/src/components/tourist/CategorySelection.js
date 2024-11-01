import React, { useEffect, useState } from "react";
import ActivityCategoryService from "../../api/ActivityCategoryService";
import { CloseOutlined } from "@ant-design/icons";

export default function CategorySelection() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ActivityCategoryService.getActivityCategories();
        const fetchedCategories = response; //NOT RESPONSE.DATA
        console.log ("categories before seeting:", fetchedCategories);
        if (Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories);
          console.log("CAT after settingggggg:", fetchedCategories);
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

  const handleNext = () => {
    console.log("Selected Categories:", selectedCategories);
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

            <button onClick={handleNext} className="button -md -dark-1 bg-accent-1 text-white col-12 mt-lg">
              Next
              <i className="icon-arrow-top-right ml-10"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
