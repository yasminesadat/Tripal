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

  const notProvidedStyle = { color: "red" };
  const addLinkStyle = {
    color: "blue",
    textDecoration: "underline",
    cursor: "pointer",
    border: "none",
    background: "none",
  };
  const headerStyle = { fontWeight: "bold" };

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
      <h2>{advertiser.userName}'s Profile</h2>
      {fields.map((field, index) => (
        <p key={index}>
          <span style={headerStyle}>{field.label}:</span>
          <br />
          {field.value ? (
            field.isLink ? (
              <a href={field.value} target="_blank" rel="noopener noreferrer">
                {field.value}
              </a>
            ) : (
              field.value
            )
          ) : (
            <>
              <span style={notProvidedStyle}>not provided</span>{" "}
              <button style={addLinkStyle} onClick={handleNavigate}>
                Add
              </button>
            </>
          )}
        </p>
      ))}
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
          <button style={addLinkStyle} onClick={handleNavigate}>
            Add
          </button>
        </>
      )}
      <br />
      <button onClick={handleNavigate}>Edit Profile</button>
    </div>
  );
};

export default AdvertiserProfile;
