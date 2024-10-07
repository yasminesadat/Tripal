import React, { useEffect, useState } from 'react';
import { getAdvertiser } from '../../api/AdvertiserService';
import { useParams, useNavigate } from 'react-router-dom'; 
import AdvertiserNavBar from "../../components/advertiser/AdvertiserNavBar";

const AdvertiserProfile = () => {
  const { id } = useParams();
  const [advertiser, setAdvertiser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const data = await getAdvertiser(id); // Make the API call
        setAdvertiser(data);
      } catch (error) {
        setError(error);
        console.error("Error fetching advertiser:", error); // This should log if there's an error
      }
    };

    fetchAdvertiser();
  }, [id]);

  const handleNavigate = () => {
    navigate(`/update-advertiser/${id}`, { state: { advertiser } });
  };

  if (error) return <p>Error: {error.message}</p>;
  if (!advertiser) return <p>Can't find advertiser...</p>;

  const notProvidedStyle = { color: "#6c757d", 
    fontStyle: "italic",};
  const addLinkStyle = {
    color: "#0056b3",  // Darker blue for a professional look
  textDecoration: "underline",
  cursor: "pointer",
  border: "none",
  background: "none",
  padding: 0,
  marginLeft: "5px",
  };
  const headerStyle = {
    fontWeight: "bold",
    fontSize: "1.1em",
    marginBottom: "5px",
  };
  
  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };
  
  const sectionTitleStyle = {
    fontSize: "1.5em",
    color: "#343a40",
    marginBottom: "20px",
  };
  
  
  const buttonStyle = {
    backgroundColor: "#2a2ea8", // Bootstrap primary blue
    color: "#fff",
    padding: "6px 12px",
    fontSize: "1em",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    display: "block",
    margin: "10px 0",  
  };
  
  const awardItemStyle = {
    padding: "10px 0",
    borderBottom: "1px solid #e9ecef",
    marginBottom: "10px",
  };

  const fields = [
    { label: "Email", value: advertiser.email },
    { label: "Website", value: advertiser.website },
    { label: "Company Name", value: advertiser.companyProfile?.companyName },
    { label: "Industry", value: advertiser.companyProfile?.industry },
    { label: "Description", value: advertiser.companyProfile?.description },
    { label: "Founded Year", value: advertiser.companyProfile?.foundedYear },
    { label: "Employees", value: advertiser.companyProfile?.employees },
    {
      label: "Address",
      value: advertiser.companyProfile?.headquarters?.address,
    },
    { label: "City", value: advertiser.companyProfile?.headquarters?.city },
    {
      label: "Country",
      value: advertiser.companyProfile?.headquarters?.country,
    },
    {
      label: "LinkedIn",
      value: advertiser.companyProfile?.socialMedia?.linkedin,
      isLink: true,
    },
    {
      label: "Twitter",
      value: advertiser.companyProfile?.socialMedia?.twitter,
      isLink: true,
    },
    {
      label: "Certifications",
      value: advertiser.companyProfile?.certifications?.join(", "),
    },
  ];

  

  return (
    <div>
      <AdvertiserNavBar />
      <div style={containerStyle}>
      <h2>{advertiser.userName}'s Profile</h2>
      {fields.map((field, index) => (
        <p key={index}>
          <span style={headerStyle}>{field.label}:</span>
          <br />
          {field.value ? (
            field.isLink ? (
              <a href={field.value} target="_blank" rel="noopener noreferrer" className="custom-link">
                {field.value}
              </a>
            ) : (
              field.value
            )
          ) : (
            <>
              <span style={notProvidedStyle}>not provided</span>{" "}
              <button style={buttonStyle} onClick={handleNavigate}>
                Add
              </button>
            </>
          )}
        </p>
      ))}
      <div style={awardItemStyle}>
      <h3 style={headerStyle}>Awards</h3>
      {advertiser.companyProfile?.awards.length > 0 ? (
        advertiser.companyProfile.awards.map((award, index) => (
          <div key={index}>
            <p>
              <span style={headerStyle}>Title:</span> {award.title}
              <br />
              <span style={headerStyle}>Year:</span> {award.year}
              <br />
              <span style={headerStyle}>Issuer:</span> {award.issuer}
            </p>
          </div>
        ))
      ) : (
        <>
          <span style={notProvidedStyle}>Awards not provided</span>{" "}
          <button style={buttonStyle} onClick={handleNavigate}>
            Add
          </button>
        </>
      )}
      </div>
      <br />
      <button onClick={handleNavigate}>Edit Profile</button>
      </div>

    </div>
  );
};

export default AdvertiserProfile;
