import React, { useEffect, useState } from "react";
import {
  createAdvertiser,
  updateAdvertiser,
  getAdvertiser,
} from "../api/AdvertiserService";
import { useParams, useLocation } from "react-router-dom";

const AdvertiserForm = ({ isUpdate, onSubmit }) => {
  const { advertiserId } = useParams();
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
    if (isUpdate && advertiserId) {
      // Fetch existing data here
      getAdvertiser(advertiserId).then((data) => {
        setFormData(data); // Set fetched data to formData
      });
    }
  }, [isUpdate, advertiserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isUpdate) {
        // Call API to update the advertiser
        await updateAdvertiser(advertiserId, formData);
      } else {
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
        />
      </div>
      <div>
        <label>Hotline:</label>
        <input
          type="tel"
          name="hotline"
          value={formData.hotline}
          onChange={handleChange}
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
          />
        </div>
        <div>
          <label>Industry:</label>
          <input
            type="text"
            name="companyProfile.industry"
            value={formData.companyProfile.industry}
            onChange={handleChange}
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
          />
        </div>
        <div>
          <label>Employees:</label>
          <input
            type="text"
            name="companyProfile.employees"
            value={formData.companyProfile.employees}
            onChange={handleChange}
          />
        </div>
        <h4>Headquarters</h4>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="headquarters.address"
            value={formData.companyProfile.headquarters.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="headquarters.city"
            value={formData.companyProfile.headquarters.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="headquarters.country"
            value={formData.companyProfile.headquarters.country}
            onChange={handleChange}
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
          />
        </div>
        <div>
          <label>Twitter:</label>
          <input
            type="text"
            name="companyProfile.socialMedia.twitter"
            value={formData.companyProfile.socialMedia.twitter}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Advertiser updated successfully!</p>
      )}
    </form>
  );
};

export default AdvertiserForm;
