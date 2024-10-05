import React, { useEffect, useState } from 'react';
import { getAdvertiser } from '../../api/AdvertiserService';
import { useParams, Link } from 'react-router-dom'; 


const AdvertiserProfile = () => {
  const { id } = useParams();
  const [advertiser, setAdvertiser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const data = await getAdvertiser(id); // Make the API call
        setAdvertiser(data);
      } catch (error) {
        setError(error);
        console.error('Error fetching advertiser:', error); // This should log if there's an error
      } 
    };

    fetchAdvertiser();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!advertiser) return <p>Cant find advertiser...</p>;

  return (
    <div>
      <h2>{advertiser.userName}'s Profile</h2>
      <p>Email: {advertiser.email}</p>
      <p>Website: {advertiser.website}</p>
      <h3>Company Profile</h3>
      <p>
        Company Name: 
        {advertiser.companyProfile?.companyName ? (
          advertiser.companyProfile.companyName
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Company Name</Link>
        )}
      </p>
      <p>
        Industry: 
        {advertiser.companyProfile?.industry ? (
          advertiser.companyProfile.industry
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Industry</Link>
        )}
      </p>
      <p>
        Description: 
        {advertiser.companyProfile?.description ? (
          advertiser.companyProfile.description
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Description</Link>
        )}
      </p>
      <p>
        Founded Year: 
        {advertiser.companyProfile?.foundedYear ? (
          advertiser.companyProfile.foundedYear
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Founded Year</Link>
        )}
      </p>
      <p>
        Employees: 
        {advertiser.companyProfile?.employees ? (
          advertiser.companyProfile.employees
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Employees</Link>
        )}
      </p>

      <h3>Headquarters</h3>
      <p>
        Address: 
        {advertiser.companyProfile?.headquarters?.address ? (
          advertiser.companyProfile.headquarters.address
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Address</Link>
        )}
      </p>
      <p>
        City: 
        {advertiser.companyProfile?.headquarters?.city ? (
          advertiser.companyProfile.headquarters.city
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add City</Link>
        )}
      </p>
      <p>
        Country: 
        {advertiser.companyProfile?.headquarters?.country ? (
          advertiser.companyProfile.headquarters.country
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Country</Link>
        )}
      </p>

      <h3>Social Media</h3>
      <p>
        LinkedIn: 
        {advertiser.companyProfile?.socialMedia?.linkedin ? (
          <a href={advertiser.companyProfile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
            {advertiser.companyProfile.socialMedia.linkedin}
          </a>
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add LinkedIn</Link>
        )}
      </p>
      <p>
        Twitter: 
        {advertiser.companyProfile?.socialMedia?.twitter ? (
          <a href={advertiser.companyProfile.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
            {advertiser.companyProfile.socialMedia.twitter}
          </a>
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Twitter</Link>
        )}
      </p>

      <h3>Certifications</h3>
      <p>
        {advertiser.companyProfile?.certifications.length > 0 ? (
          advertiser.companyProfile.certifications.join(', ')
        ) : (
          <Link to={`/update-advertiser/${advertiser.id}`}>Add Certifications</Link>
        )}
      </p>

      <h3>Awards</h3>
      {advertiser.companyProfile?.awards.length > 0 ? (
        advertiser.companyProfile.awards.map((award, index) => (
          <div key={index}>
            <p>Title: {award.title}</p>
            <p>Year: {award.year}</p>
            <p>Issuer: {award.issuer}</p>
          </div>
        ))
      ) : (
        <Link to={`/update-advertiser/${advertiser.id}`}>Add Awards</Link>
      )}
      <Link to={`/update-advertiser/${advertiser.id}`}>
        <button>Edit Profile</button>
      </Link>
    </div>
  );
};

export default AdvertiserProfile;
