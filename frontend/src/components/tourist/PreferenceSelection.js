import React, { useEffect, useState } from "react";
import { getTags } from "../../api/PreferenceTagService";
import { CloseOutlined } from "@ant-design/icons";

export default function PreferenceSelection() {
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

  const handleNext = () => {
    console.log("Selected Tags:", selectedTags);
  };

  return (
    <section className="mt-header layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="text-center mb-lg">
              <h1 className="text-30">Tell us more about your vacation preferences!</h1>
            </div>
            <div className="selected-tags mb-lg">
              {selectedTags.map((tagId) => {
                const tag = tags.find((tag) => tag._id === tagId);
                return (
                  tag && (
                    <div key={tag._id} className="selected-tag">
                      <span>{tag.icon} {tag.name}</span>
                      <CloseOutlined onClick={() => removeTag(tag._id)} />
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
                    className={`tag-item ${selectedTags.includes(tag._id) ? "selected" : ""}`}
                    onClick={() => handleTagChange(tag._id)}
                  >
                    <span>{tag.icon} {tag.name}</span>
                  </div>
                ))
              ) : (
                <p>No tags available</p>
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
