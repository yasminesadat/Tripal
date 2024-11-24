import React, { useEffect, useState } from 'react';
import { useNavigate, usenavigate, useParams } from 'react-router-dom';
import { updateProfile, getProfileData } from "../../api/TourGuideService";
// import '../seller/SellerProfile.css';
// import TourguideNavBar from "../../components/navbar/TourguideNavBar";
import ChangePassword from "../../components/common/ChangePassword";
import { requestAccountDeletion } from "../../api/RequestService";
import { message } from 'antd';
import { tourGuideID } from '../../IDs';
import Stars from './Component/Stars';
const TourGuideProfile = () => {
  const id = tourGuideID;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [image1, setImage1] = useState("");
  const [languagesSpoken, setLanguagesSpoken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfileData(id);
        if (!response) {
          throw new Error("TourGuide not found");
        }
        const data = await response.data;
        setUser(data);
        // setLanguagesSpoken(user.languagesSpoken.length>0?user.languagesSpoken.join(", "):"");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDeletion = async () => {
    try {
      const response = await requestAccountDeletion();
      message.success(response.message);
      navigate("/");
    } catch (error) {
      message.warning(error.response?.data?.message || "An error occurred");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* <TourguideNavBar /> */}
      {/* <div
        className={`dashboard ${
          sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}
      > */}
      {/* <Sidebar setSideBarOpen={setSideBarOpen} /> */}

      <div className="dashboard__content">
        {/* <Header setSideBarOpen={setSideBarOpen} /> */}

        <div className="dashboard__content_content">
          <h1 className="text-35">My Profile</h1>
          <p className="">Tourguide profile</p>
          <div className="mt-50 rounded-12 bg-white shadow-2 px-40 pt-40 pb-30">
           
  
          <div className="row x-gap-40 y-gap-20 items-center pt-20">
          <div className="col-auto">
              <div className="d-flex items-center">
              <h5 className="text-30 fw-500 mb-30">Profile Details</h5>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex x-gap-5 pr-10">
                  <Stars star={user?.averageRating} font={12} />
                </div>
                {user?.averageRating} 
              </div>
            </div>
      </div>
            <div className="contactForm row y-gap-30">
              <div className="col-md-6">
                <div className="form-input ">
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
                  <input type="text" value={user.name} readOnly />
                  <label className="lh-1 text-16 text-light-1">Name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-input ">
                  <input type="text" value={user.userName} readOnly />
                  <label className="lh-1 text-16 text-light-1">
                    userName
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-input ">
                  <input type="text" value={user.mobileNumber} readOnly />
                  <label className="lh-1 text-16 text-light-1">PhoneNumber</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input type="text" value={user.nationality} readOnly />
                  <label className="lh-1 text-16 text-light-1">Nationality</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input type="multiple" readOnly value={user.languagesSpoken.join(" , ")} />
                  <label className="lh-1 text-16 text-light-1">
                    languages
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input type="text" value={user.email} readOnly />
                  <label className="lh-1 text-16 text-light-1">Email</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input ">
                  <input type="text" value={user.yearsOfExperience} readOnly />
                  <label className="lh-1 text-16 text-light-1">Years of Experience</label>
                </div>
              </div>

              {/* <div className="col-md-6">
                  <div className="form-input ">
                    <textarea readOnly rows="8"></textarea>
                    <label className="lh-1 text-16 text-light-1">Info</label>
                  </div>
                </div> */}
             <divider />
             <div> <h5 className="text-30 fw-500 mb-30">{`Education`}</h5><divider /><hr /></div> 
            <div className="contactForm row y-gap-30">
              
              {user.education.map((edu, idx) => (
              
                <card className="col-md-6" title={`Education ${idx+1}`}  key={idx} >
                  <h5 className="text-17 fw-500 mb-30">{`Education ${idx+1}`}</h5>
              <div >
                <div className="form-input ">
                  <input type="text" value={edu.degree} readOnly />
                  <label className="lh-1 text-16 text-light-1"> Degree </label>
                </div>
              </div>
              <div >
                <div className="form-input ">
                  <input type="text" value={edu.institution} readOnly />
                  <label className="lh-1 text-16 text-light-1"> Institution </label>
                </div>
              </div>
              <div >
                <div className="form-input ">
                  <input type="text" value={edu.yearOfCompletion} readOnly />
                  <label className="lh-1 text-16 text-light-1"> Year of Completion  </label>
                </div>
              </div>
            </card>))}
            <divider />
            <div> <h5 className="text-30 fw-500 mb-30">{`Previous Work`}</h5><divider /><hr /></div>
          <div className="contactForm row y-gap-30">
            {user.previousWork.map((work, idx) => (
                <card className="col-md-6" title={`Work ${idx+1}`}  key={idx} >
                  <h5 className="text-20 fw-500 mb-30">{`Previous work ${idx+1}`}</h5>
              <div >
                <div className="form-input ">
                  <input type="text" value={work.companyName} readOnly />
                  <label className="lh-1 text-16 text-light-1"> Company Name </label>
                </div>
              </div>
              <div >
                <div className="form-input ">
                  <input type="text" value={work.position} readOnly />
                  <label className="lh-1 text-16 text-light-1"> Position </label>
                </div>
              </div>
              <div >
                <div className="form-input ">
                  <input type="text" value={work.location} readOnly />
                  <label className="lh-1 text-16 text-light-1"> Location </label>
                </div>
              </div>
              <div >
                <div className="form-input ">
                  <input type="text" value={new Date(work.startDate).toLocaleDateString()} readOnly />
                  <label className="lh-1 text-16 text-light-1"> Start Date</label>
                </div>
              </div>
              <div >
                <div className="form-input ">
                  <input type="text" value={new Date(work.endDate).toLocaleDateString()} readOnly />
                  <label className="lh-1 text-16 text-light-1"> End Date </label>
                </div>
              </div>
              <div >
              <label style={{color:'black'}}className="lh-1 text-16 text-light-1">Description</label>
                  <div className="form-input ">
                    <textarea value={work.description} readOnly rows="6"/>
                    
                  </div>
                </div>
            </card>
          
          ))}
           </div>
          </div>
            {/* <label className="lh-1 text-16 text-light-1">Years of Experience</label>
          </div>
        </div> */}

        <div className="col-12">
          <h4 className="text-18 fw-500 mb-20">Your photo</h4>
          <div className="row x-gap-20 y-gap">
            <div className="col-auto">
              <div className="relative">
                {user.profilePicture !== "" && <img
                  src={user.profilePicture}
                  alt="image"
                  className="size-200 rounded-12 object-cover"
                />}
              </div>
            </div>

          </div>


          <button className="button -md -dark-1 bg-accent-1 text-white mt-30" onClick={() => {
            navigate(`/tourguide/update`);
          }}>
            Edit
            <i className="icon-arrow-top-right text-16 ml-10"></i>
          </button>
        </div>
      </div>
    </div>
          </div >
        </div >
        <ChangePassword id={tourGuideID} userType="tour guide" />
        <button onClick={handleDeletion}>Delete Account</button>

      </div >

      );
};

export default TourGuideProfile;
