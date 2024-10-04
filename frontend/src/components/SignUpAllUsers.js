import React, { useState } from "react";
import { createSeller } from "../api/SellerService";
import { createTourGuide } from "../api/TourGuideService";
import { createAdvertiser } from "../api/AdvertiserService";
import { createTourist } from "../api/TouristService";
import { nationalities } from "../assets/Nationalities";
import { useNavigate } from "react-router-dom";

const SignUpAllUsers = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    mobileNumber: "",
    nationality: "",
    dateOfBirth: "",
    job: "",
  });

  const [role, setRole] = useState("seller");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formattedDateOfBirth = new Date(formData.dateOfBirth)
      .toISOString()
      .split("T")[0];

    const commonUser = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
    };

    let newUser;

    if (role === "tourist") {
      newUser = {
        ...commonUser,
        mobileNumber: formData.mobileNumber,
        nationality: formData.nationality,
        dateOfBirth: formattedDateOfBirth,
        job: formData.job,
      };
    } else {
      newUser = commonUser;
    }

    try {
      if (role === "seller") {
        await createSeller(newUser);
      } else if (role === "tour-guide") {
        await createTourGuide(newUser);
      } else if (role === "advertiser") {
        await createAdvertiser(newUser);
      } else if (role === "tourist") {
        await createTourist(newUser);
      }
      setSuccess(true);
      if (role === "tourist") {
        navigate("/tourist-home");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signUpUsersForm-container">
      <h2 className="signUpUsersForm-title">Sign Up</h2>
      {error && <p className="signUpUsersForm-error">{error.message}</p>}
      {success && <p className="signUpUsersForm-success">Sign up successful!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="signUpUsersForm-label" htmlFor="userName">User Name:</label>
          <input
            className="signUpUsersForm-input"
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="signUpUsersForm-label" htmlFor="email">Email:</label>
          <input
            className="signUpUsersForm-input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="signUpUsersForm-label" htmlFor="password">Password:</label>
          <input
            className="signUpUsersForm-input"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="signUpUsersForm-label">
            <input
              className="signUpUsersForm-radio"
              type="radio"
              name="role"
              value="seller"
              checked={role === "seller"}
              onChange={handleRoleChange}
            />
            Seller
          </label>
          <label className="signUpUsersForm-label">
            <input
              className="signUpUsersForm-radio"
              type="radio"
              name="role"
              value="tour-guide"
              checked={role === "tour-guide"}
              onChange={handleRoleChange}
            />
            Tour Guide
          </label>
          <label className="signUpUsersForm-label">
            <input
              className="signUpUsersForm-radio"
              type="radio"
              name="role"
              value="advertiser"
              checked={role === "advertiser"}
              onChange={handleRoleChange}
            />
            Advertiser
          </label>
          <label className="signUpUsersForm-label">
            <input
              className="signUpUsersForm-radio"
              type="radio"
              name="role"
              value="tourist"
              checked={role === "tourist"}
              onChange={handleRoleChange}
            />
            Tourist
          </label>
        </div>

        {role === "tourist" && (
          <>
            <div>
              <label className="signUpUsersForm-label" htmlFor="mobileNumber">Mobile Number:</label>
              <input
                className="signUpUsersForm-input"
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="signUpUsersForm-label" htmlFor="nationality">Nationality:</label>
              <select
                className="signUpUsersForm-select"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              >
                <option value="">Select Nationality</option>
                {nationalities.map((nationality, index) => (
                  <option key={index} value={nationality}>
                    {nationality}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="signUpUsersForm-label">Date of Birth</label>
              <input
                className="signUpUsersForm-input"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="signUpUsersForm-label" htmlFor="job">Job</label>
              <input
                className="signUpUsersForm-input"
                type="text"
                id="job"
                name="job"
                value={formData.job}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <button className="signUpUsersForm-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpAllUsers;
