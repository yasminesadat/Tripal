import { React, useState } from 'react';
import { Button, Modal } from "antd";
import LocationMap from "./MapComponent";

const MapPopUp = ({ markerPosition, setMarkerPosition, setSelectedLocation, selectedLocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal} style={{
        width: '100%',
      }}>
        Add location
      </Button>
      <Modal title="Choose your location" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <LocationMap
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
          setSelectedLocation={setSelectedLocation}
        />
        <div style={{ marginTop: '10px' }}>
          <strong>Selected Location:</strong> {selectedLocation || 'No location selected yet'}
        </div>
      </Modal>
    </>
  );
}
export default MapPopUp

