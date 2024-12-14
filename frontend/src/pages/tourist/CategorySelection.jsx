import { useEffect, useState } from "react";
import ActivityCategoryService from "../../api/ActivityCategoryService";
import { updateTouristInformation } from "../../api/TouristService";
import { CloseOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import TouristHeader from "@/components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
export default function CategorySelection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ActivityCategoryService.getActivityCategories();
        const fetchedCategories = response; // NOT RESPONSE.DATA
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
      message.error("Please select at least one category before proceeding");
      return;
    }
    try {
      const body = { categories: selectedCategories };
      await updateTouristInformation(body);
      console.log("Categories saved successfully!");
      navigate("/tourist");
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  const handleSkip = () => {
    navigate("/tourist");
  };

  const tagItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, border 0.3s',
  };

  const tagItemHoverStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  };

  const tagItemSelectedStyle = {
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    border: '1px solid rgba(0, 123, 255, 0.5)',
  };

  const selectedTagContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  };

  const selectedTagStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374971', 
    color: 'white',
    borderRadius: '20px',
    padding: '5px 10px',
    fontSize: '14px',
    position: 'relative',
  };

  const closeIconStyle = {
    marginLeft: '5px',
    cursor: 'pointer',
  };

  return (
    <div className="page-wrapper">
      <TouristHeader />
      <main className="page-content-hana">
        <section className="mt-header layout-pt-lg layout-pb-lg">
          <div className="container">
            <div className="row justify-center">
              <div className="col-xl-6 col-lg-7 col-md-9">
                <div className="text-center mb-lg">
                  <h1 className="text-30">What categories of activities do you prefer?</h1>
                </div>
                <div style={selectedTagContainerStyle}>
                  {selectedCategories.map((categoryId) => {
                    const category = categories.find((cat) => cat._id === categoryId);
                    return (
                      category && (
                        <div key={category._id} style={selectedTagStyle}>
                          <span>{category.Name}</span>
                          <CloseOutlined onClick={() => removeCategory(category._id)} style={closeIconStyle} />
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
                        style={{
                          ...tagItemStyle,
                          ...(selectedCategories.includes(category._id) ? tagItemSelectedStyle : {}),
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = tagItemHoverStyle.backgroundColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = selectedCategories.includes(category._id) ? tagItemSelectedStyle.backgroundColor : 'transparent';
                        }}
                        onClick={() => handleCategoryChange(category._id)}
                      >
                        <span>{category.Name}</span>
                      </div>
                    ))
                  ) : (
                    <p>No categories available</p>
                  )}
                </div>
                <br />
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
      </main>
      <FooterThree />
    </div>
  );
}
