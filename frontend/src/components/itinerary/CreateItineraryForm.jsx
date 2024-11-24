import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, DatePicker, Select, Typography, message } from "antd";
import LocationMap from '../common/MapComponent';
import languages  from '../../assets/constants/Languages';
import AccessibilityTags from '../../assets/constants/AccessibiltyTags';
import ActivitySelectionModal from '../itinerary/ActivitySelectionModal';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function CreateItineraryForm() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]); //(London)
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [numDays, setNumDays] = useState(0); // Store the number of days
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
        const startDate = dates[0].startOf("day");
        const endDate = dates[1].startOf("day");
        const duration = endDate.diff(startDate, "days") + 1;
        setNumDays(duration);
    } else 
        setNumDays(0);
    };

    const handleSelectActivities = (activities) => {
        setSelectedActivities(activities);
    };

    const onFinish = (values) => {
        console.log("Form Values: ", values);
        message.success("Itinerary created successfully!");
    };

    const onFinishFailed = (errorInfo) => {
        message.error("Please complete all required fields.");
        console.log("Form Errors: ", errorInfo);
    };

    return (
      <div className="full-height-container">
        <MDBContainer fluid className="p-2">
          <MDBRow>
            {/* Left Section with Images and Text */}
            <MDBCol
              md="3"
              className="text-center text-md-start d-flex flex-column align-items-center"
            >
              <div className="images-container">
                <img
                  src="/img/hero/3/1.png"
                  alt="image"
                  className="background-image"
                />
                <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="hero__subtitle mb-20 md:mb-10"
              >
                Plan Your Dream Itinerary with Ease
              </div>
  
              <h1 className="hero__title" data-aos="fade-up" data-aos-delay="300">
                Create
                <br className="md:d-none" />
                Memorable
                <br className="md:d-none" />
                Adventures!
                <br />
              </h1>
                <img
                  src="/img/hero/3/2.png"
                  alt="image"
                  className="background-image"
                />
              </div>
              
            </MDBCol>
  
            {/* Right Section with Form */}
            <MDBCol md="6">
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    maxWidth: "75%",
                    margin: "auto",
                    padding: "20px",
                  }}
                >
                  <Title level={3} style={{ textAlign: "center" }}>
                    Create a New Itinerary
                  </Title>
            
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    requiredMark={false}
                    style={{ width: "100%" }}
                  >
                    {/* Itinerary Title */}
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[{ required: true, message: "Please enter the itinerary title" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
            
                    {/* Description */}
                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[{ required: true, message: "Please enter a description" }]}
                    >
                      <Input.TextArea rows={4} size="large" />
                    </Form.Item>
            
                    {/* Available Date */}
                    <Form.Item
                      label="Available Date"
                      name="availableDate"
                      rules={[{ required: true, message: "Please select the available dates" }]}
                    >
                      <RangePicker style={{ width: "100%" }} size="large" onChange={handleDateChange}/>
                    </Form.Item>

                    <Form.Item>
                    <Button onClick={() => setIsModalVisible(true)}>
                        Select Activities ({numDays} Days)
                    </Button>
                    <ActivitySelectionModal
                        isVisible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        onSelectActivities={handleSelectActivities}
                        preSelectedActivities={selectedActivities}
                        maxActivities={numDays} // Pass the max activities based on the duration
                    />
                    </Form.Item>

                    {/* Service Fee */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Service Fee"
                          name="serviceFee"
                          rules={[{ required: true, message: "Please enter the service fee" }]}
                        >
                          <Input prefix="$" size="large" />
                        </Form.Item>
                      </Col>
            
                      <Col span={12}>
                        {/* Language */}
                        <Form.Item
                          label="Language"
                          name="language"
                          rules={[{ required: true, message: "Please select a language" }]}
                        >
                          <Select placeholder="Select language" size="large">
                            {languages.map((language) => (
                              <Option key={language} value={language}>
                                {language}
                              </Option>
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
                        style={{ width: "100%" }}
                        placeholder="Enter tags and press Enter"
                        size="large">
                        {AccessibilityTags.map((accessibility) => (
                            <Option key={accessibility} value={accessibility}>
                              {accessibility}
                            </Option>
                          ))}
                        </Select>
                    </Form.Item>

                    {/* Locations */}
                    <Form.Item
                      label="Pick up Location"
                      name="pickup location"
                      rules={[{ required: true, message: "Please add at least one location" }]}
                    >
                      <LocationMap
                        markerPosition={markerPosition}
                        setMarkerPosition={setMarkerPosition}
                        setSelectedLocation={setSelectedLocation}
                        />
                    </Form.Item>
                    <Form.Item
                      label="Drop off Location"
                      name="dropoff location"
                      rules={[{ required: true, message: "Please add at least one location" }]}
                    >
                      <LocationMap
                        markerPosition={markerPosition}
                        setMarkerPosition={setMarkerPosition}
                        setSelectedLocation={setSelectedLocation}
                        />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="custom-button"
                        style={{ width: "100%", height: "50px" }}
                      >
                        Create Itinerary
                      </Button>
                    </Form.Item>
                  </Form>
                  <style>{`
                    .custom-button {
                      background-color: var(--color-dark-purple) !important;
                      border-color: var(--color-dark-purple) !important;
                    }
                    .custom-button:hover {
                      background-color: var(--color-light-purple) !important;
                      border-color: var(--color-light-purple) !important;
                    }
                  `}</style>
                </Card>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <style>{`
          .full-height-container {
            height: 250vh !important;
            margin-left: 2% !important;
            margin-top: 10vh !important;
            margin-right:-15% !important;
            display: flex !important;
            flex-direction: column !important;
            // justify-content: center !important;
            // align-items: center !important;
            position: relative !important;
          }
  
          .images-container {
          position: relative;
          width: 100%;
          height: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
  
          .background-image {
            width: 80%;
            height: auto;
          }
  
          .images-container img:nth-child(1) {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
          }
  
          .images-container img:nth-child(2) {
            grid-column: 1 / 2;
            grid-row: 2 / 3;
          }
  
          .images-container img:nth-child(3) {
            grid-column: 2 / 3;
            grid-row: 1 / 3;
          }
  
          .itinerary-form {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }
  
          .form-title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
          }
  
          .form-submit-button {
            width: 100%;
            background-color: #ff5722;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
          }
        `}</style>
      </div>
    );
  }