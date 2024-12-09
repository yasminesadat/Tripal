import React, { useEffect, useState } from "react";
import { getTags } from "../../api/PreferenceTagService";
import { CloseOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { updateTouristInformation } from "../../api/TouristService";
import { message } from "antd";
import TouristHeader from "@/components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
export default function PreferenceSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const touristId = location.state?.touristId;
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        const fetchedTags = response.data;
        if (Array.isArray(fetchedTags)) {
          setTags(fetchedTags);
        } else {
          setTags([]);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (tagId) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagId)
        ? prevSelected.filter((id) => id !== tagId)
        : [...prevSelected, tagId]
    );
  };

  const removeTag = (tagId) => {
    setSelectedTags((prevSelected) =>
      prevSelected.filter((id) => id !== tagId)
    );
  };

  const handleNext = async () => {
    if (selectedTags.length === 0) {
      message.error("Please select at least one preference tag before proceeding");
      return;
    }

    try {
      const body = { tags: selectedTags };
      await updateTouristInformation(body);
      console.log("Preferences saved successfully!");
      navigate(`/tourist/select-categories`);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const handleSkip = () => {
    navigate(`/tourist/select-categories`);
  };

  // Inline styles
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
    backgroundColor: '#374971', // Background color
    color: 'white', // Text color
    borderRadius: '20px',
    padding: '5px 10px',
    fontSize: '14px', // Font size
    position: 'relative', // For positioning the close icon
  };

  const closeIconStyle = {
    marginLeft: '5px',
    cursor: 'pointer',
  };

  return (
    <div className="page-wrapper">
      <TouristHeader />
      <main className="page-content">
        <section className="mt-header layout-pt-lg layout-pb-lg">
          <div className="container">
            <div className="row justify-center">
              <div className="col-xl-6 col-lg-7 col-md-9">
                <div className="text-center mb-lg">
                  <h1 className="text-30">Tell us more about your vacation preferences!</h1>
                </div>

                <div style={selectedTagContainerStyle}>
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((tag) => tag._id === tagId);
                    return (
                      tag && (
                        <div key={tag._id} style={selectedTagStyle}>
                          <span className="flex items-center">
                            {tag.icon} {tag.name}
                          </span>
                          <CloseOutlined
                            onClick={() => removeTag(tag._id)}
                            style={closeIconStyle}
                          />
                        </div>
                      )
                    );
                  })}
                </div>

                <div className="preference-tags mb-lg border-1 rounded-12 px-20 py-20">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <div
                        key={tag._id}
                        style={{
                          ...tagItemStyle,
                          ...(selectedTags.includes(tag._id) ? tagItemSelectedStyle : {}),
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = tagItemHoverStyle.backgroundColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = selectedTags.includes(tag._id) ? tagItemSelectedStyle.backgroundColor : 'transparent';
                        }}
                        onClick={() => handleTagChange(tag._id)}
                      >
                        <span>{tag.icon} {tag.name}</span>
                      </div>
                    ))
                  ) : (
                    <p>No tags available</p>
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
