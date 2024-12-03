import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, DatePicker, Select, Typography, message } from "antd";
import LocationMap from '../common/MapComponent';
import languages from '../../assets/constants/Languages';
import AccessibilityTags from '../../assets/constants/AccessibiltyTags';
import ActivitySelectionModal from './ActivitySelectionModal';
import { createItinerary } from '../../api/ItineraryService';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function CreateItineraryForm() {
  // State declarations
  const [loading, setLoading] = useState(false);
  const [pickupLocation, setPickUpLocation] = useState(null);
  const [dropoffLocation, setDropOffLocation] = useState(null);
  const [pickupMarkerPosition, setPickUpMarkerPosition] = useState([51.505, -0.09]);
  const [dropoffMarkerPosition, setDropOffMarkerPosition] = useState([51.505, -0.09]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [numDays, setNumDays] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Event handlers
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      var startDate = dates[0].startOf("day");
      if (startDate.isBefore(new Date(), "day")) {
        message.error("Start date cannot be in the past.");
        dates = null;
        startDate = null;
        return;
      }
      var endDate = dates[1].startOf("day");
      if (endDate.isBefore(startDate, "day")) {
        message.error("End date cannot be before start date.");
        dates = null;
        endDate = null;
        return;
      }
      if (endDate.isBefore(new Date(), "day")) {
        message.error("End date cannot be in the past.");
        dates = null;
        endDate = null;
        return;
      }
      const duration = endDate.diff(startDate, "days") + 1;
      setNumDays(duration);
    } else setNumDays(0);
  };

  const handleSelectActivities = (activities) => {
    setSelectedActivities(activities);
  };

  const onFinish = (values) => {
    console.log("Form Values: ", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form Errors: ", errorInfo);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const itineraryData = {
      title: values.title,
      description: values.description,
      serviceFee: values.serviceFee,
      language: values.language,
      accessibility: values.accessibility,
      startDate: values.availableDate[0],
      endDate: values.availableDate[1],
      activities: selectedActivities.map(activity => activity._id),
      pickupLocation: pickupLocation,
      dropoffLocation: dropoffLocation,
    };

    if (values.availableDate[0].isBefore(new Date(), "day") || values.availableDate[1].isBefore(new Date(), "day")) {
      return message.error("Please enter future dates for the itinerary.");
    }
    if (!selectedActivities || selectedActivities.length === 0) {
      return message.error("Please select activities for the itinerary.");
    }

    try {
      setLoading(true);
      await createItinerary(itineraryData);
      message.success("Itinerary created successfully!");
      form.resetFields();
      setSelectedActivities([]);
    } catch (error) {
      message.error('Failed to create itinerary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard__content bg-light-2">
      <div className="dashboard__content_wrapper">
        <div className="dashboard__content_container">
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="4">
                <div className="sticky-sidebar">
                  <div className="text-center">
                    <img src="/img/hero/3/1.png" alt="hero" className="hero-image" />
                    <h3 className="hero__subtitle">Plan Your Dream Itinerary with Ease</h3>
                    <h1 className="hero__title">
                      Create<br />
                      Memorable<br />
                      Adventures!
                    </h1>
                    <img src="/img/hero/3/2.png" alt="hero" className="hero-image" />
                  </div>
                </div>
              </MDBCol>

              <MDBCol md="8">
                <Card className="form-card">
                  <Title level={3}>Create a New Itinerary</Title>

                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    requiredMark={false}
                  >
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="Title"
                          name="title"
                          rules={[{ required: true, message: "Please enter the itinerary title" }]}
                        >
                          <Input
                            size="large"
                            style={{
                              height: "50px",
                              border: "1px solid #d9d9d9",
                              outline: "none",
                              width: "100%",
                              backgroundColor: "transparent"
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Available Date"
                          name="availableDate"
                          rules={[{ required: true, message: "Please select dates" }]}
                        >
                          <RangePicker
                            style={{ width: "100%" }}
                            size="large"
                            onChange={handleDateChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[{ required: true, message: "Please enter a description" }]}
                    >
                      <Input.TextArea rows={4} size="large" />
                    </Form.Item>

                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="Service Fee"
                          name="serviceFee"
                          rules={[{ required: true, message: "Please enter the service fee" }]}
                        >
                          <Input
                            prefix="$"
                            size="large"
                            style={{
                              height: "50px",
                              border: "1px solid #d9d9d9",
                              outline: "none",
                              width: "100%",
                              backgroundColor: "transparent"
                            }}
                            placeholder="0"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Language"
                          name="language"
                          rules={[{ required: true, message: "Please select a language" }]}
                        >
                          <Select
                            size="large"
                            style={{
                              width: "100%",
                              height: "50px"
                            }}
                            placeholder="Select language"
                          >
                            {languages.map((language) => (
                              <Option key={language} value={language}>
                                {language}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="Select Activities"
                        >
                          <Button
                            size="large"
                            onClick={() => setIsModalVisible(true)}
                            style={{
                              width: "100%",
                              height: "50px",
                              border: "1px solid #d9d9d9",
                            }}
                          >
                            Select Activities ({numDays} Days)
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Accessibility Tags"
                          name="accessibility"
                          tooltip="Add accessibility options such as wheelchair access, braille, etc."
                        >
                          <Select
                            mode="tags"
                            size="large"
                            style={{
                              width: "100%",
                              height: "50px"
                            }}
                            placeholder="Enter accessibility options"
                          >
                            {AccessibilityTags.map((tag) => (
                              <Option key={tag} value={tag}>
                                {tag}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="Pickup Location"
                          name="pickupLocation"
                          rules={[{ required: !pickupLocation, message: "Please select pickup location" }]}
                        >
                          <LocationMap
                            markerPosition={pickupMarkerPosition}
                            setMarkerPosition={setPickUpMarkerPosition}
                            setSelectedLocation={setPickUpLocation}
                            selectedLocation={pickupLocation}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Drop Off Location"
                          name="dropoffLocation"
                          rules={[{ required: !dropoffLocation, message: "Please select drop off location" }]}
                        >
                          <LocationMap
                            markerPosition={dropoffMarkerPosition}
                            setMarkerPosition={setDropOffMarkerPosition}
                            setSelectedLocation={setDropOffLocation}
                            selectedLocation={dropoffLocation}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item>
                      <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleSubmit}
                        style={{ width: "100%" }}
                      >
                        Create Itinerary
                      </Button>
                    </Form.Item>
                  </Form>

                  <ActivitySelectionModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSelectActivities={handleSelectActivities}
                    preSelectedActivities={selectedActivities}
                    maxActivities={numDays}
                  />
                </Card>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </div>

      <style>{`
        .dashboard__content {
          flex: 1;
          background: linear-gradient(135deg, #e5f8f8 0%, #dac4d0 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .dashboard__content_wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .sticky-sidebar {
          position: sticky;
          top: 2rem;
          padding: 2rem;
        }

        .hero-image {
          max-width: 80%;
          height: auto;
          margin: 1rem 0;
        }

        .hero__subtitle {
          color: #8f5774;
          font-size: 1.4rem;
          margin: 1.5rem 0;
        }

        .hero__title {
          color: #e0829d;
          font-size: 2.5rem;
          font-weight: bold;
          line-height: 1.3;
          margin: 1rem 0;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(143, 87, 116, 0.1);
          padding: 2rem;
          border: none;
        }

        .ant-form-item {
          margin-bottom: 1.5rem;
        }

        .ant-form-item-label > label {
          color: #8f5774;
          font-weight: 500;
        }

        .ant-input,
        .ant-input-number,
        .ant-picker,
        .ant-select:not(.ant-select-customize-input) .ant-select-selector {
          border: 1px solid #dac4d0;
          border-radius: 8px;
          min-height: 42px;
        }

        .ant-input:focus,
        .ant-select-focused .ant-select-selector,
        .ant-picker-focused {
          border-color: #e0829d !important;
          box-shadow: 0 0 0 2px rgba(224, 130, 157, 0.1) !important;
        }

        .ant-btn-primary {
          background: #8f5774;
          border-color: #8f5774;
        }

        .ant-btn-primary:hover {
          background: #e0829d;
          border-color: #e0829d;
        }

        .ant-typography {
          color: #8f5774;
          text-align: center;
          margin-bottom: 2rem;
        }

        .map-container {
          height: 250px;
          border: 1px solid #dac4d0;
          border-radius: 8px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .dashboard__content_wrapper {
            padding: 0 1rem;
          }

          .form-card {
            padding: 1rem;
          }

          .sticky-sidebar {
            position: static;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}