import { useState, useEffect } from "react";
import { Select, message } from 'antd';
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dasboard/Sidebar";
import MetaComponent from "@/components/common/MetaComponent";
import TouristHeader from "@/components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import Badge from "@/components/tourist/Badge";
import { nationalities } from "@/assets/Nationalities";
import { getTouristInformation, updateTouristInformation, redeemPoints } from "../../api/TouristService";
import { requestAccountDeletion } from "../../api/RequestService";
import { getTouristTags, getTouristCategories } from "../../api/TouristService";
import { getTags } from "../../api/PreferenceTagService";
import ActivityCategoryService from "../../api/ActivityCategoryService";

import { changeTouristPassword } from '../../api/TouristService';
import { getUserData } from '@/api/UserService';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'; 

import Spinner from "@/components/common/Spinner";

const metadata = {
  title: "Profile || Tripal",
};


const StyledMultiSelect = ({ value, onChange, options, label }) => {
  return (
    <div className="form-input">
      <Select
        mode="multiple"
        value={value}
        onChange={onChange}
        options={options.map(tag => ({
          value: tag._id,
          label: tag.name || tag.Name
        }))}
        className="styled-multi-select"
        popupClassName="styled-multi-dropdown"
        placeholder=" "
      />
      <label className="lh-1 text-16 text-light-1">{label}</label>
    </div>
  );
};

const StyledNationalitySelect = ({ value, onChange, options }) => {
  return (
    <div className="form-input">
      <Select
        value={value}
        onChange={(value) => onChange({ target: { name: 'nationality', value } })}
        options={options.map(nat => ({ value: nat, label: nat }))}
        className="styled-select"
        popupClassName="styled-select-dropdown"
        placeholder=" "
      />
      <label className="lh-1 text-16 text-light-1 elevated-label">Nationality</label>
      <style jsx global>{`
        .form-input .elevated-label {
          transform: translateY(-29px) !important;
          font-size: 16px !important;  /* Increased from 12px to 16px */
          color: var(--color-stone) !important;
          background: white;
          padding: 0 5px;
          z-index: 1;
        }

        /* Adjust spacing to accommodate larger font */
        .form-input {
          margin-top: 10px !important;
        }

        .styled-select .ant-select-selector {
          padding-left: 10px !important;
        }
      `}</style>
    </div>
  );
};




export default function Profile() {

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserData();
        setUserData(user.data.id);
        setUserRole(user.data.role);
        console.log("id is ", user.data.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
  const [userData, setUserData] = useState("");
  const [userRole, setUserRole] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [profileInformation, setProfileInformation] = useState({});
  const [touristTags, setTouristTags] = useState([]);
  const [touristCategories, setTouristCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allCats, setAllCats] = useState([]);

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [PasswordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const [editedProfile, setEditedProfile] = useState({
    email: "",
    nationality: "",
    job: "",
    mobileNumber: "",

    tags: [],
    categories: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    try {
      if (PasswordForm.newPassword.length < 6) {
        message.error("Password must be at least 6 characters long");
        return;
      }
      if (PasswordForm.newPassword !== PasswordForm.confirmPassword) {
        message.error("Passwords don't match");
        return;
      }

      console.log("user", userData);
      console.log("old pass, new pass", PasswordForm.oldPassword, PasswordForm.newPassword);
      await changeTouristPassword(userData, PasswordForm.oldPassword, PasswordForm.newPassword);
      message.success("Password changed successfully");

      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      message.error(error.response?.data?.message || "Failed to change password");
      console.error("Password change error:", error);
    }
  };
  const handleEditClick = async () => {
    try {
      await updateTouristInformation(editedProfile);
      message.success("Profile updated successfully");
      await fetchTouristTags();
      await fetchTouristCategories();
    } catch (error) {
      console.error("Failed to update user information:", error);
      message.error("Failed to update profile");
    }
  };

  const handleTagsChange = (value) => {
    setEditedProfile((prevState) => ({
      ...prevState,
      tags: value,
    }));
  };

  const handleCategoriesChange = (value) => {
    setEditedProfile((prevState) => ({
      ...prevState,
      categories: value,
    }));
  };

  const getUserInformation = async () => {
    try {
      const response = await getTouristInformation();
      setProfileInformation(response);
      setEditedProfile({
        email: response.email,
        nationality: response.nationality,
        job: response.job,
        mobileNumber: response.mobileNumber,
        tags: response.tags,
        categories: response.categories
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user information:", error);
      setLoading(false);
    }
  };

  const fetchTouristTags = async () => {
    try {
      const tags = await getTouristTags();
      setTouristTags(tags);
    } catch (error) {
      console.error("Error fetching tourist tags:", error);
    }
  };

  const fetchTouristCategories = async () => {
    try {
      const tags = await getTouristCategories();
      setTouristCategories(tags);
    } catch (error) {
      console.error("Error fetching tourist tags:", error);
    }
  };

  const fetchAllTags = async () => {
    try {
      const tags = await getTags();
      setAllTags(tags.data);
    } catch (error) {
      console.error("Error fetching tourist tags:", error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const tags = await ActivityCategoryService.getActivityCategories();
      setAllCats(tags);
    } catch (error) {
      console.error("Error fetching tourist tags:", error);
    }
  };

  const handleRedeemClick = async () => {
    if (profileInformation.currentPoints < 10000) {
      message.warning("No enough points to redeem");
      return;
    }
    try {
      await redeemPoints();
      await getUserInformation();
      message.success("points redeemed successfully");
    } catch (error) {
      message.error("redemption failed")
    }
  };

  const handleDeletion = async () => {
    try {
      message.success(response.message);
      navigate("/");
    } catch (error) {
      message.warning(error.response?.data?.message || "An error occurred.");
    }
  };

  useEffect(() => {
    getUserInformation();
    fetchTouristTags();
    fetchTouristCategories();
    fetchAllTags();
    fetchAllCategories();
  }, []);



  const handleImageChange = (event, func) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        func(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  if (loading) {
    return <Spinner />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TouristHeader />
        <main className="page-content">
          <div className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}>
            <Sidebar setSideBarOpen={setSideBarOpen} />
            <div className="dashboard__content">
              <div className="dashboard__content_content">
                <h2>Profile</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h5>{profileInformation.userName}</h5>
                  <Badge totalPoints={profileInformation.totalPoints} />
                </div>

                <div className="mt-50 rounded-12 bg-white shadow-2 px-40 pt-40 pb-30">
                  <h5 className="text-20 fw-500 mb-30">Profile Details</h5>

                  <div className="contactForm row y-gap-30">
                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          name="userName"
                          value={profileInformation.userName}
                          readOnly
                        />
                        <label className="lh-1 text-16 text-light-1">Username</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          name="email"
                          value={editedProfile.email}
                          onChange={handleInputChange}
                        />
                        <label className="lh-1 text-16 text-light-1">Email</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          name="dateOfBirth"
                          value={new Date(profileInformation.dateOfBirth).toLocaleDateString()}
                          readOnly
                        />
                        <label className="lh-1 text-16 text-light-1">Date of Birth</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          name="mobileNumber"
                          value={editedProfile.mobileNumber}
                          onChange={handleInputChange}
                        />
                        <label className="lh-1 text-16 text-light-1">Phone Number</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        {profileInformation.wallet ? (
                          <input
                            type="text"
                            name="walletBalance"
                            value={`${profileInformation.wallet.amount} ${profileInformation.wallet.currency}`}
                            readOnly
                          />
                        ) : (
                          <span>No wallet information available</span>
                        )}
                        <label className="lh-1 text-16 text-light-1">Wallet</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="points-container">
                        <div className="form-input">
                          <input
                            type="text"
                            name="currentPoints"
                            value={profileInformation.currentPoints}
                            readOnly
                          />
                          <label className="lh-1 text-16 text-light-1">Points</label>
                        </div>
                        <button onClick={handleRedeemClick} className="button -md -dark-1 " style={{ marginTop: '0.75rem' }}>
                          Redeem Points
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          name="job"
                          value={editedProfile.job}
                          onChange={handleInputChange}
                        />
                        <label className="lh-1 text-16 text-light-1">Job</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <StyledNationalitySelect
                        value={editedProfile.nationality}
                        onChange={handleInputChange}
                        options={nationalities}
                      />
                    </div>

                    <div className="col-12">
                      <p className="section-header">
                        <b>Preference Tags</b>
                      </p>
                      <StyledMultiSelect
                        value={editedProfile.tags}
                        onChange={handleTagsChange}
                        options={allTags}
                      />
                    </div>

                    <div className="col-12">
                      <p className="section-header">
                        <b>Activity Categories</b>
                      </p>
                      <StyledMultiSelect
                        value={editedProfile.categories}
                        onChange={handleCategoriesChange}
                        options={allCats}
                      />
                    </div>

                    <div className="col-12">
                      <div className="d-flex justify-between mt-30">
                        <button onClick={handleEditClick} className="button -md -dark-1">
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                        <button className="button -md -dark-1 delete-btn" onClick={handleDeletion}>
                          Delete Account
                          <i className="icon-delete text-20 ml-10"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-30">
                  <h5 className="text-20 fw-500 mb-30">Change Password</h5>

                  <div className="contactForm y-gap-30">


                    <div className="row y-gap-30">
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            type={showPassword.oldPassword ? "text" : "password"}
                            name="oldPassword"
                            value={PasswordForm.oldPassword}
                            onChange={handlePasswordInput}
                            required
                            minLength={6}
                          />
                          <label className="lh-1 text-16 text-light-1">Old password</label>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('oldPassword')}
                            className="password-toggle"
                          >
                            {showPassword.oldPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          </button>
                          <style jsx>{`
        .form-input {
          position: relative;
        }
        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-stone);
          z-index: 2;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .password-toggle:hover {
          color: var(--color-stone-light);
        }
        .form-input input {
          padding-right: 40px;
        }
      `}</style>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            type={showPassword.newPassword ? "text" : "password"}
                            name="newPassword"
                            value={PasswordForm.newPassword}
                            onChange={handlePasswordInput}
                            required
                            minLength={6}
                          />
                          <label className="lh-1 text-16 text-light-1">New password</label>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('newPassword')}
                            className="password-toggle"
                          >
                            {showPassword.newPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-input">
                          <input
                            type={showPassword.confirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={PasswordForm.confirmPassword}
                            onChange={handlePasswordInput}
                            required
                            minLength={6}
                          />
                          <label className="lh-1 text-16 text-light-1">Confirm new password</label>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            className="password-toggle"
                          >
                            {showPassword.confirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <button className="button -md -dark-1" onClick={handleChangePassword}>
                          Save Changes
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </main>
        <FooterThree />
      </div>

      <style jsx global>{`
  :root {
    --color-dark-purple: #8f5774;
    --color-light-purple: #dac4d0;
    --color-pink: #e0829d;
    --color-stone: #036264;
    --color-stone-light: #5a9ea0;
    --color-footer: #e5f8f8;
  }

  /* Form Inputs */
  .contactForm .form-input {
    position: relative;
    margin-bottom: 20px;
  }

  .contactForm .form-input label {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: 0.3s ease;
    color: #aaa;
    z-index: 1;
    background: white;
    padding: 0 5px;
  }

  .contactForm .form-input input:focus + label,
  .contactForm .form-input textarea:focus + label,
  .contactForm .form-input input:not(:placeholder-shown) + label,
  .contactForm .form-input textarea:not(:placeholder-shown) + label,
  .contactForm .form-input input.filled + label,
  .contactForm .form-input textarea.filled + label,
  .form-input .ant-select-focused + label,
  .form-input .ant-select-selection-item + label,
  .form-input .ant-select-open + label,
  .form-input .ant-select-selection-placeholder + label {
    transform: translateY(-29px);
    font-size: 12px;
    color: var(--color-stone);
  }

  .contactForm .form-input input,
  .contactForm .form-input textarea {
    padding: 10px;
    font-size: 16px;
    width: 100%;
    border: 1px solid var(--color-light-purple);
    outline: none;
    border-radius: 8px;
    height: 44px;
  }

  /* Select Styles */
  .styled-select,
  .styled-multi-select {
    width: 100%;
  }

  .styled-select .ant-select-selector,
  .styled-multi-select .ant-select-selector {
    height: 44px !important;
    padding: 5px 10px !important;
    font-size: 16px !important;
    border: 1px solid var(--color-light-purple) !important;
    border-radius: 8px !important;
    background-color: white !important;
  }

  .styled-multi-select .ant-select-selector {
    min-height: 44px !important;
    height: auto !important;
    padding: 4px 8px !important;
  }

  .styled-select .ant-select-selection-search-input,
  .styled-multi-select .ant-select-selection-search-input {
    height: 42px !important;
  }

  .styled-select .ant-select-selection-item,
  .styled-multi-select .ant-select-selection-item {
    line-height: 32px !important;
    color: var(--color-stone) !important;
  }

  .styled-multi-select .ant-select-selection-overflow {
    padding: 4px 0;
  }

  .styled-multi-select .ant-select-selection-item {
    height: 32px !important;
    background-color: var(--color-footer) !important;
    border-color: var(--color-stone-light) !important;
    border-radius: 6px !important;
    padding: 0 10px !important;
    margin: 4px !important;
    display: flex !important;
    align-items: center !important;
  }

  .styled-select:hover .ant-select-selector,
  .styled-multi-select:hover .ant-select-selector {
    border-color: var(--color-stone) !important;
  }

  .styled-select.ant-select-focused .ant-select-selector,
  .styled-multi-select.ant-select-focused .ant-select-selector {
    border-color: var(--color-stone) !important;
    box-shadow: 0 0 0 2px rgba(3, 98, 100, 0.1) !important;
  }

  .styled-select-dropdown,
  .styled-multi-dropdown {
    padding: 6px !important;
    border-radius: 8px !important;
  }

  .styled-select-dropdown .ant-select-item,
  .styled-multi-dropdown .ant-select-item {
    padding: 8px 12px !important;
    color: var(--color-stone) !important;
    border-radius: 6px !important;
  }

  .styled-select-dropdown .ant-select-item-option-selected,
  .styled-multi-dropdown .ant-select-item-option-selected {
    background-color: var(--color-footer) !important;
    font-weight: 500 !important;
  }

  .styled-select-dropdown .ant-select-item-option-active,
  .styled-multi-dropdown .ant-select-item-option-active {
    background-color: var(--color-light-purple) !important;
  }

  /* Points Container */
  .points-container {
    display: flex;
    gap: 5px;
  }

  .points-container .form-input {
    flex: 2;
    margin-bottom: 0;
  }

  /* Button Styles */
  .button.-md.-dark-1 {
    background-color: var(--color-stone) !important;
    border: none;
    height: 44px !important;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    color: white !important;
    cursor: pointer;
  }

  .button.-md.-dark-1:hover {
    background-color: var(--color-stone-light) !important;
  }

  .button.-md.-dark-1.delete-btn {
    background-color: var(--color-pink) !important;
  }

  .button.-md.-dark-1.delete-btn:hover {
    background-color: var(--color-dark-purple) !important;
  }

  /* Section Headers */
  .section-header {
    color: var(--color-stone);
    margin: 20px 0 10px;
    font-size: 16px;
  }

  /* Clear Icon */
  .ant-select-clear {
    background: white !important;
    color: var(--color-stone) !important;
  }

  /* Remove Tag Icon */
  .ant-select-selection-item-remove {
    color: var(--color-stone) !important;
    font-size: 12px !important;
    margin-left: 4px !important;
  }

  /* Dropdown Arrow */
  .ant-select-arrow {
    color: var(--color-stone) !important;
  }

  /* Empty Content */
  .ant-select-empty {
    color: #aaa !important;
    padding: 10px !important;
  }
`}</style>
    </>
  );
}
