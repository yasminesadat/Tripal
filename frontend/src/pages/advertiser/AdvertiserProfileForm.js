import React, { useEffect, useState } from 'react';
import { createAdvertiser,updateAdvertiser, getAdvertiser } from '../../api/AdvertiserService';
import { useParams, useLocation } from 'react-router-dom';
import AdvertiserNavBar from "../../components/advertiser/AdvertiserNavBar";

const AdvertiserForm = ({ isUpdate, onSubmit }) => {
  const { id } = useParams();
  const location = useLocation();
  const advertiser = location.state?.advertiser;

  const [formData, setFormData] = useState({
    userName: advertiser?.userName || "",
    email: advertiser?.email || "",
    password: "",
    website: advertiser?.website || "",
    hotline: advertiser?.hotline || "",
    companyProfile: {
      companyName: advertiser?.companyProfile?.companyName || "",
      industry: advertiser?.companyProfile?.industry || "",
      description: advertiser?.companyProfile?.description || "",
      foundedYear: advertiser?.companyProfile?.foundedYear || "",
      employees: advertiser?.companyProfile?.employees || "",
      headquarters: {
        address: advertiser?.companyProfile?.headquarters?.address || "",
        city: advertiser?.companyProfile?.headquarters?.city || "",
        country: advertiser?.companyProfile?.headquarters?.country || "",
      },
      socialMedia: {
        linkedin: advertiser?.companyProfile?.socialMedia?.linkedin || "",
        twitter: advertiser?.companyProfile?.socialMedia?.twitter || "",
      },
      certifications: advertiser?.companyProfile?.certifications || [],
      awards: advertiser?.companyProfile?.awards || [],
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUpdate && id) {
      // Fetch existing data here
      getAdvertiser(id).then((data) => {
        setFormData(data); // Set fetched data to formData
      });
    }
  }, [isUpdate, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (name === "companyProfile.employees") {
      // Convert value to number
      const numberValue = Number(value);

      // Check if the value is a valid number
      if (isNaN(numberValue) || numberValue < 0) {
          setError("Please enter a valid number for Employees.");
          return;
      } else {
          // Clear the error if valid
          setError("");
      }
  }
  if (name === "companyProfile.foundedYear") {
    const numberValue = Number(value);
    const currentYear = new Date().getFullYear();

    if (isNaN(numberValue)) {
        setError("Please enter a valid year.");
        return;
    } else {
        // Clear the error if valid
        setError("");
    }
}

    setFormData((prevData) => {
      let updatedData = { ...prevData };

      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = value;
        } else {
          acc[key] = { ...acc[key] };
        }
        return acc[key];
      }, updatedData);

      return updatedData;
    });
  };

  // Handle dynamic input changes for certifications and awards
  const handleItemChange = (e, index, field, type) => {
    const { value } = e.target;
  
    setFormData((prevData) => {
      const updatedItems = [...prevData.companyProfile[type]];
  
      // Handle 'certifications' case (array of strings)
      if (type === 'certifications') {
        updatedItems[index] = value; // Directly update the string value
  
      // Handle 'awards' case (array of objects with properties)
      } else if (type === 'awards') {
        updatedItems[index] = { 
          ...updatedItems[index], // Spread existing properties
          [field]: value // Update the specific field (e.g., 'title', 'year', 'issuer')
        };
      }
  
      return {
        ...prevData,
        companyProfile: {
          ...prevData.companyProfile,
          [type]: updatedItems, // Update either certifications or awards
        },
      };
    });
  };
  

// Handle adding a new certification or award
const handleAddItem = (type) => {
  setFormData((prevData) => {
    const updatedItems = [...prevData.companyProfile[type], { title: "" }];
    return {
      ...prevData,
      companyProfile: {
        ...prevData.companyProfile,
        [type]: updatedItems,
      },
    };
  });
};

// Handle removing a certification or award
const handleRemoveItem = (index, type) => {
  setFormData((prevData) => {
    const items = prevData.companyProfile[type] || [];

    // Only proceed if it's a valid array
    const updatedItems = Array.isArray(items)
      ? items.filter((_, i) => i !== index)
      : [];
    return {
      ...prevData,
      companyProfile: {
        ...prevData.companyProfile,
        [type]: updatedItems,
      },
    };
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isUpdate) {
        // Call API to update the advertiser
        await updateAdvertiser(id, formData);
      } else {
        console.log(formData)
        // Call API to create a new advertiser
        await createAdvertiser(formData);
      }
      setSuccess("Advertiser updated successfully!");
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred while updating.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdvertiserNavBar />
      <div>
        <label>User Name:</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Website:</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Enter your website URL"
        />
      </div>
      <div>
        <label>Hotline:</label>
        <input
          type="tel"
          name="hotline"
          value={formData.hotline}
          onChange={handleChange}
          placeholder="Enter your hotline number"
        />
      </div>
      <div>
        <h3>Company Profile</h3>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            name="companyProfile.companyName"
            value={formData.companyProfile.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label>Industry:</label>
          <input
            type="text"
            name="companyProfile.industry"
            value={formData.companyProfile.industry}
            onChange={handleChange}
            placeholder="Enter Industry"
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="companyProfile.description"
            value={formData.companyProfile.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Founded Year:</label>
          <input
            type="text"
            name="companyProfile.foundedYear"
            value={formData.companyProfile.foundedYear}
            onChange={handleChange}
            placeholder="Enter valid year"
          />
        </div>
        <div>
          <label>Employees:</label>
          <input
            type="text"
            name="companyProfile.employees"
            value={formData.companyProfile.employees}
            onChange={handleChange}
            placeholder="Enter number of employees"
          />
        </div>
        <h4>Headquarters</h4>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="companyProfile.headquarters.address"
            value={formData.companyProfile.headquarters.address}
            onChange={handleChange}
            placeholder="Enter address"

          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="companyProfile.headquarters.city"
            value={formData.companyProfile.headquarters.city}
            onChange={handleChange}
            placeholder="Enter city"

          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="companyProfile.headquarters.country"
            value={formData.companyProfile.headquarters.country}
            onChange={handleChange}
            placeholder="Enter country"

          />
        </div>
        <h4>Social Media</h4>
        <div>
          <label>LinkedIn:</label>
          <input
            type="text"
            name="companyProfile.socialMedia.linkedin"
            value={formData.companyProfile.socialMedia.linkedin}
            onChange={handleChange}
            placeholder="Enter linkedin profile link"

          />
        </div>
        <div>
          <label>Twitter:</label>
          <input
            type="text"
            name="companyProfile.socialMedia.twitter"
            value={formData.companyProfile.socialMedia.twitter}
            onChange={handleChange}
            placeholder="Enter twitter profile link"

          />
        </div>
        {/* Certifications Section */}
        <div>
          <h4>Certifications</h4>
          {formData.companyProfile.certifications.map((cert, index) => (
            <div key={index}>
              <input
                type="text"
                name={`companyProfile.certifications[${index}]`}
                value={cert}
                onChange={(e) =>
                  handleItemChange(e, index, null, 'certifications') // Pass 'null' for field since it's an array of strings
                }
              />
              <button type="button" onClick={() => handleRemoveItem(index, 'certifications')}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem('certifications')}>
            Add Certification
          </button>
        </div>

        {/* Awards Section */}
        <div>
          <h4>Awards</h4>
          {formData.companyProfile.awards.map((award, index) => (
            <div key={index}>
              <input
                type="text"
                name={`companyProfile.awards[${index}].title`}
                value={award.title}
                onChange={(e) =>
                  handleItemChange(e, index, 'title', 'awards') // Specify 'title' for the awards field
                }
                placeholder="Award Title"
              />
              <input
                type="number"
                name={`companyProfile.awards[${index}].year`}
                value={award.year || ''} // Handle undefined case for year
                onChange={(e) =>
                  handleItemChange(e, index, 'year', 'awards') // Specify 'year' for the awards field
                }
                placeholder="Year"
              />
              <input
                type="text"
                name={`companyProfile.awards[${index}].issuer`}
                value={award.issuer || ''} // Handle undefined case for issuer
                onChange={(e) =>
                  handleItemChange(e, index, 'issuer', 'awards') // Specify 'issuer' for the awards field
                }
                placeholder="Issuer"
              />
              <button type="button" onClick={() => handleRemoveItem(index, 'awards')}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem('awards')}>
            Add Award
          </button>
        </div>

      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Profile updated successfully!</p>
      )}
    </form>
  );
};

export default AdvertiserForm;
