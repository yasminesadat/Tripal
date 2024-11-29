import { Modal, Form, Input, Button, Row, Col, Select, DatePicker, message } from 'antd';
const { RangePicker } = DatePicker;
import { useState, useEffect } from 'react';
import ActivitySelectionModal from './ActivitySelectionModal';
import languages from '@/assets/constants/Languages';
import AccessibilityTags from '@/assets/constants/AccessibiltyTags';
import MapPopUp from '@/components/common/MapPopUp';

const UpdateItineraryModal = ({ itinerary, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickupLocation, setPickUpLocation] = useState(itinerary.pickupLocation || '');  
  const [dropoffLocation, setDropOffLocation] = useState(itinerary.dropoffLocation || '');  
  const [pickupMarkerPosition, setPickUpMarkerPosition] = useState([51.505, -0.09]);
  const [dropoffMarkerPosition, setDropOffMarkerPosition] = useState([51.505, -0.09]);
  const [selectedActivities, setSelectedActivities] = useState(itinerary.activities || []);
  const [numDays, setNumDays] = useState(itinerary.timeline.length || 1);

  const [dateRange, setDateRange] = useState([
    itinerary.startDate ? new Date(itinerary.startDate) : null,
    itinerary.endDate ? new Date(itinerary.endDate) : null
  ]);

  useEffect(() => {
    // Whenever itinerary changes, update the state with the new start and end dates
    setDateRange([
      itinerary.startDate ? new Date(itinerary.startDate) : null,
      itinerary.endDate ? new Date(itinerary.endDate) : null
    ]);
  }, [itinerary]);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
        var startDate = dates[0].startOf("day");
        if(startDate.isBefore(new Date(), "day")) {
            message.error("Start date cannot be in the past.");
            dates = null;
            startDate = null;
            return;
        }
        var endDate = dates[1].startOf("day");
        if(endDate.isBefore(startDate, "day")) {
            message.error("End date cannot be before start date.");
            dates = null;
            endDate = null;
            return;
        }
        if(endDate.isBefore(new Date(), "day")) {
            message.error("End date cannot be in the past.");
            dates = null;
            endDate = null;
            return;
        }
        const duration = endDate.diff(startDate, "days") + 1;
        setNumDays(duration);
    } else 
        setNumDays(0);
    };

  const handleSelectActivities = (activities) => {
    setSelectedActivities(activities);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const updatedItinerary = { ...form.getFieldsValue() };
      updatedItinerary.activities = selectedActivities;
      updatedItinerary.pickupLocation = pickupLocation;
      updatedItinerary.dropoffLocation = dropoffLocation;
      updatedItinerary.startDate = dateRange[0] ? dateRange[0].toISOString() : null;
      updatedItinerary.endDate = dateRange[1] ? dateRange[1].toISOString() : null;
      onUpdate(updatedItinerary);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Update Itinerary"
      onCancel={onCancel}
      footer={null}
      width="50%"
    >
      <Form
        form={form}
        initialValues={{
          title: itinerary.title,
          description: itinerary.description,
          serviceFee: itinerary.serviceFee,
          language: itinerary.language,
          accessibility: itinerary.accessibility || [],
          startDate: dateRange[0],
        endDate: dateRange[1],
        }}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ width: '100%' }}
      >
        {/* Itinerary Title */}
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the itinerary title' }]}
        >
          <Input size="large" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea rows={4} size="large" />
        </Form.Item>

        {/* Available Date */}
        <Form.Item
          label="Available Date"
          name="availableDate"
          rules={[{ required: true, message: 'Please select the available dates' }]}
        >
          <RangePicker
            style={{ width: '100%' }}
            size="large"
            value={dateRange.length === 2 ? [dateRange[0], dateRange[1]] : []}
            onChange={handleDateChange}
          />
        </Form.Item>

        {/* Activities Button */}
        <Form.Item>
          <Button
            style={{
              color: 'black',
              borderColor: '#036264',
              ':hover': { borderColor: '#5a9ea0' },
              ':focus': { borderColor: '#5a9ea0' },
            }}
            onClick={() => setIsModalVisible(true)}
          >
            Select Activities
          </Button>
          <ActivitySelectionModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSelectActivities={handleSelectActivities}
            preSelectedActivities={selectedActivities}
            maxActivities={numDays}
          />
        </Form.Item>

        {/* Service Fee and Language */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Service Fee"
              name="serviceFee"
              rules={[{ required: true, message: 'Please enter the service fee' }]}
            >
              <Input prefix="$" size="large" placeholder="0" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true, message: 'Please select a language' }]}
            >
              <Select placeholder="Select language" size="large" style={{ borderColor: '#e0829d' }}>
                {languages.map((language) => (
                  <Select.Option key={language} value={language}>
                    {language}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Accessibility Tags */}
        <Form.Item
          label="Accessibility Tags"
          name="accessibility"
          tooltip="Add accessibility options such as wheelchair access, braille, etc."
        >
          <Select
            mode="tags"
            placeholder="Enter tags and press Enter"
            size="large"
            style={{ width: '100%', borderColor: '#5a9ea0' }}
          >
            {AccessibilityTags.map((accessibility) => (
              <Select.Option key={accessibility} value={accessibility}>
                {accessibility}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Locations */}
        <Form.Item>
          <label>Pickup Location:</label>
          <Input
            type="text"
            name="pickupLocation"
            value={pickupLocation}
            required
          />
          <MapPopUp
            markerPosition={pickupMarkerPosition}
            setMarkerPosition={setPickUpMarkerPosition}
            setSelectedLocation={setPickUpLocation}
            selectedLocation = {pickupLocation}
          />
        </Form.Item>
        <Form.Item>
          <label>Dropoff Location:</label>
          <Input
            type="text"
            name="dropoffLocation"
            value={dropoffLocation}
            required
          />
          <MapPopUp
            markerPosition={dropoffMarkerPosition}
            setMarkerPosition={setDropOffMarkerPosition}
            setSelectedLocation={setDropOffLocation}
            selectedLocation = {dropoffLocation}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={false}
            className="custom-button"
            style={{ width: '100%', height: '50px' }}
          >
            Update Itinerary
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateItineraryModal;
