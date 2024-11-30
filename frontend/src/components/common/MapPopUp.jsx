import { useState } from 'react';
import { Button, Modal, message } from "antd";
import LocationMap from "./MapComponent";
import axios from "axios";

const MapPopUp = ({ markerPosition, setMarkerPosition, setSelectedLocation, selectedLocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (response.data && response.data.display_name) {
        setAddress(response.data.display_name);
        setSelectedLocation(response.data.display_name);
      } else {
        message.error("Unable to fetch address. Try again later.");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      message.error("Failed to fetch the address.");
    }
  };

  const handleMarkerChange = (position) => {
    setMarkerPosition(position);
    const [lat, lng] = position;
    fetchAddress(lat, lng);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
        Add location
      </Button>
      <Modal
        title="Choose your location"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <LocationMap
          markerPosition={markerPosition}
          setMarkerPosition={handleMarkerChange}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
        <div style={{ marginTop: '10px' }}>
          <strong>Selected Location:</strong> {address || 'No location selected yet'}
        </div>
      </Modal>
    </>
  );
};

export default MapPopUp;