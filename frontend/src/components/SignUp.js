import React, { useState } from "react";
import { createSeller } from "../api/SellerService";
import { createTourGuide } from "../api/TourGuideService";
import { createAdvertiser } from "../api/AdvertiserService";

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
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

    const newUser = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
    };

    try {
      if (role === "seller") {
        await createSeller(newUser);
      } else if (role === "tour-guide") {
        await createTourGuide(newUser);
      } else if (role === "advertiser") {
        await createAdvertiser(newUser);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Sign up successful!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">User Name:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="seller"
              checked={role === "seller"}
              onChange={handleRoleChange}
            />
            Seller
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="tour-guide"
              checked={role === "tour-guide"}
              onChange={handleRoleChange}
            />
            Tour Guide
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="advertiser"
              checked={role === "advertiser"}
              onChange={handleRoleChange}
            />
            Advertiser
          </label>
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
