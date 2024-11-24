import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";
import { useState, useEffect } from "react";
import { getTouristInformation, updateTouristInformation, redeemPoints } from "../../api/TouristService";
import { useNavigate, useParams } from "react-router-dom";
import { nationalities } from "@/assets/Nationalities";
import Badge from "@/components/tourist/Badge";
import Currency from "../../components/tourist/Currency";
// import ChangePassword from "../../components/common/ChangePassword";
import { requestAccountDeletion } from "../../api/RequestService";
import { message } from 'antd';
import { getTouristTags } from "../../api/TouristService";
import { getTouristCategories } from "../../api/TouristService";
import { getTags } from "../../api/PreferenceTagService";
import ActivityCategoryService from "../../api/ActivityCategoryService";
import { Select } from 'antd';
import { Tag } from 'antd';
export default function Profile() {
  const [sideBarOpen, setSideBarOpen] = useState(false);


  const [profileInformation, setProfileInformation] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [touristTags, setTouristTags] = useState([]);
  const [touristCategories, setTouristCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allCats, setAllCats] = useState([]);
  const navigate = useNavigate();

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

  const handleEditClick = async () => {
    if (isEditing) {
      // Save and call the API
      setIsEditing(false);
      console.log("New value", editedProfile);
      try {
        const response = await updateTouristInformation(id, editedProfile);
        console.log("Profile updated successfully", response);
        toast.success("Profile updated successfully");
        await fetchTouristTags();
        await fetchTouristCategories();
      } catch (error) {
        console.error("Failed to update user information:", error);
        toast.error("Error updating profile");
      }
    } else {
      // Clicking on edit
      setIsEditing(true);
      console.log("Editing mode enabled");
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
      sessionStorage.removeItem("currency");
      sessionStorage.setItem("currency", response.choosenCurrency);
    } catch (error) {
      console.error("Failed to fetch user information:", error);
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
    if (profileInformation.currentPoints === 0) {
      toast.warning("No points to redeem");
      return;
    }
    try {
      await redeemPoints();
      await getUserInformation();
      toast.success("points redeemed successfully");
    } catch (error) {
      toast.error("redemption failed")
    }
  };

  const handleDeletion = async () => {
    try {
      const response = await requestAccountDeletion("Tourist", id);
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
  return (
    <>

      <div
        className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""
          } js-dashboard`}
      >

        {profileInformation.totalPoints !== undefined && (
          <Badge totalPoints={profileInformation.totalPoints} />
        )}
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className="dashboard__content">

          <div className="dashboard__content_content">
            <h1 className="text-30">Tourist profile</h1>
            <p className="">{profileInformation.userName}</p>
            <div className="mt-50 rounded-12 bg-white shadow-2 px-40 pt-40 pb-30">
              <h5 className="text-20 fw-500 mb-30">Profile Details</h5>

              <div className="contactForm row y-gap-30">
                <div className="col-md-6">
                  <div className="form-input ">
                    <input
                      type="text"
                      name="userName"
                      value={editedProfile.userName}
                      readOnly

                    />
                    <label className="lh-1 text-16 text-light-1">Username</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-input ">
                    <input
                      type="text"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleInputChange} // Handle input changes


                    />
                    <label className="lh-1 text-16 text-light-1">
                      Email
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-input ">
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={new Date(
                        editedProfile.dateOfBirth
                      ).toLocaleDateString()}
                      readOnly

                    />
                    <label className="lh-1 text-16 text-light-1">Date of Birth</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-input ">
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
                  <div className="form-input ">
                    {profileInformation.wallet ? (
                      <input
                        type="text"
                        name="walletBalance"
                        value={
                          profileInformation.wallet.amount +
                          " " +
                          profileInformation.wallet.currency
                        }
                        readOnly
                      />
                    ) : (
                      <span>No wallet information available</span>
                    )}
                    <label className="lh-1 text-16 text-light-1">Wallet</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-input">
                    {profileInformation.currentPoints !== undefined ? (
                      <input
                        type="text"
                        name="currentPoints"
                        value={profileInformation.currentPoints} // Corrected value assignment
                        readOnly
                      />
                    ) : (
                      <span>No points information available</span>
                    )}
                    <label className="lh-1 text-16 text-light-1">Total Points</label>

                  </div>
                  <button onClick={handleRedeemClick} style={{ marginLeft: '10px' }}>
                    Redeem points to cash
                  </button>
                </div>
                <div className="col-md-6">
                  <div className="form-input ">
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
                  <div className="form-input ">
                    <input
                      type="text"
                      name="nationality"
                      value={editedProfile.nationality}
                      onChange={handleInputChange}

                    />
                    <label className="lh-1 text-16 text-light-1">Nationality</label>
                  </div>
                </div>

                <p>
                  <b>Chosen Preference Tags:</b>
                </p>

                <Select
                  mode="multiple"
                  value={editedProfile.tags}
                  onChange={handleTagsChange}
                  placeholder="Select tags"
                  style={{ width: '100%' }}
                >
                  {allTags.map((tag) => (
                    <Select.Option key={tag._id} value={tag._id}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
                <p>
                  <b>Chosen Activity Categories:</b>
                </p>

                <Select
                  mode="multiple"
                  value={editedProfile.categories}
                  onChange={handleCategoriesChange}
                  placeholder="Select Categories"
                  style={{ width: '100%' }}
                >
                  {allCats.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.Name}
                    </Select.Option>
                  ))}
                </Select>



                <div className="col-12">
                  <button className="button -md -dark-1 bg-accent-1 text-white mt-30">
                    Save Changes
                    <i className="icon-arrow-top-right text-16 ml-10"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-30">
              <h5 className="text-20 fw-500 mb-30">Change Password</h5>

              <div className="contactForm y-gap-30">
                <div className="row y-gap-30">
                  <div className="col-md-6">
                    <div className="form-input ">
                      <input type="text" required />
                      <label className="lh-1 text-16 text-light-1">
                        Old password
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-input ">
                      <input type="text" required />
                      <label className="lh-1 text-16 text-light-1">
                        New password
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-input ">
                      <input type="text" required />
                      <label className="lh-1 text-16 text-light-1">
                        Confirm new password
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <button className="button -md -dark-1 bg-accent-1 text-white">
                      Save Changes
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-30">
              © Copyright Tripal {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
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
          }
        .contactForm .form-input input:focus + label,
        .contactForm .form-input textarea:focus + label,
        .contactForm .form-input input:not(:placeholder-shown) + label,
        .contactForm .form-input textarea:not(:placeholder-shown) + label,
        .contactForm .form-input input.filled + label,
        .contactForm .form-input textarea.filled + label {
          transform: translateY(-29px);
        font-size: 12px;
        color: #333;
          }
        .contactForm .form-input input,
        .contactForm .form-input textarea {
          padding: 10px;
        font-size: 16px;
        width: 100%;
        border: 1px solid #ccc;
        outline: none;
          }
          `}
      </style>
    </>



  );
}
