import React, { useState, useEffect } from 'react';
import { createAdvertiser, getAdvertiser, updateAdvertiser } from '../api/AdvertiserService';
import { useParams, useNavigate } from 'react-router-dom';

const AdvertiserForm = ({ isUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '', 
    website: '',
    hotline: '',
    companyProfile: {
      companyName: '',
      industry: '',
      description: '',
      foundedYear: '',
      employees: '',
      headquarters: {
        address: '',
        city: '',
        country: '',
      },
      socialMedia: {
        linkedin: '',
        twitter: '',
      },
      certifications: [],
      awards: [
        { title: '', year: '', issuer: '' },
      ]
    }
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch existing advertiser data when updating
  useEffect(() => {
    if (isUpdate && id) {
      getAdvertiser(id)
        .then((res) => {
          setFormData(res.data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [id, isUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setFormData((prevState) => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      if (isUpdate) {
        await updateAdvertiser(id, formData);
      } else {
        await createAdvertiser(formData);
      }
      setSuccess(true);
      navigate('/advertisers'); // Redirect after successful form submission
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{isUpdate ? 'Update Advertiser Profile' : 'Create Advertiser Profile'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Success!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Name</label>
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        {!isUpdate && (
          <div>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
        )}
        <div>
          <label>Website</label>
          <input type="url" name="website" value={formData.website} onChange={handleChange} required />
        </div>
        <div>
          <label>Hotline</label>
          <input type="text" name="hotline" value={formData.hotline} onChange={handleChange} required />
        </div>

        {/* Company Profile */}
        <h3>Company Profile</h3>
        <div>
          <label>Company Name</label>
          <input type="text" name="companyProfile.companyName" value={formData.companyProfile.companyName} onChange={handleChange} />
        </div>
        <div>
          <label>Industry</label>
          <input type="text" name="companyProfile.industry" value={formData.companyProfile.industry} onChange={handleChange} />
        </div>
        <div>
          <label>Description</label>
          <textarea name="companyProfile.description" value={formData.companyProfile.description} onChange={handleChange} />
        </div>
        <div>
          <label>Founded Year</label>
          <input type="number" name="companyProfile.foundedYear" value={formData.companyProfile.foundedYear} onChange={handleChange} />
        </div>
        <div>
          <label>Employees</label>
          <input type="number" name="companyProfile.employees" value={formData.companyProfile.employees} onChange={handleChange} />
        </div>

        {/* Headquarters */}
        <h4>Headquarters</h4>
        <div>
          <label>Address</label>
          <input type="text" name="companyProfile.headquarters.address" value={formData.companyProfile.headquarters.address} onChange={handleChange} />
        </div>
        <div>
          <label>City</label>
          <input type="text" name="companyProfile.headquarters.city" value={formData.companyProfile.headquarters.city} onChange={handleChange} />
        </div>
        <div>
          <label>Country</label>
          <input type="text" name="companyProfile.headquarters.country" value={formData.companyProfile.headquarters.country} onChange={handleChange} />
        </div>

        {/* Social Media */}
        <h4>Social Media</h4>
        <div>
          <label>LinkedIn</label>
          <input type="url" name="companyProfile.socialMedia.linkedin" value={formData.companyProfile.socialMedia.linkedin} onChange={handleChange} />
        </div>
        <div>
          <label>Twitter</label>
          <input type="url" name="companyProfile.socialMedia.twitter" value={formData.companyProfile.socialMedia.twitter} onChange={handleChange} />
        </div>

        {/* Certifications */}
        <div>
          <label>Certifications (Comma Separated)</label>
          <input type="text" name="companyProfile.certifications" value={formData.companyProfile.certifications.join(', ')} onChange={(e) => setFormData({ ...formData, companyProfile: { ...formData.companyProfile, certifications: e.target.value.split(', ') }})} />
        </div>

        {/* Awards */}
        <h4>Awards</h4>
        {formData.companyProfile.awards.map((award, index) => (
          <div key={index}>
            <label>Award Title</label>
            <input type="text" name={`companyProfile.awards[${index}].title`} value={award.title} onChange={(e) => {
              const updatedAwards = [...formData.companyProfile.awards];
              updatedAwards[index].title = e.target.value;
              setFormData({ ...formData, companyProfile: { ...formData.companyProfile, awards: updatedAwards } });
            }} />
            <label>Award Year</label>
            <input type="number" name={`companyProfile.awards[${index}].year`} value={award.year} onChange={(e) => {
              const updatedAwards = [...formData.companyProfile.awards];
              updatedAwards[index].year = e.target.value;
              setFormData({ ...formData, companyProfile: { ...formData.companyProfile, awards: updatedAwards } });
            }} />
            <label>Issuer</label>
            <input type="text" name={`companyProfile.awards[${index}].issuer`} value={award.issuer} onChange={(e) => {
              const updatedAwards = [...formData.companyProfile.awards];
              updatedAwards[index].issuer = e.target.value;
              setFormData({ ...formData, companyProfile: { ...formData.companyProfile, awards: updatedAwards } });
            }} />
          </div>
        ))}

        <button type="submit">{isUpdate ? 'Update' : 'Create'} Advertiser</button>
      </form>
    </div>
  );
};

export default AdvertiserForm;
