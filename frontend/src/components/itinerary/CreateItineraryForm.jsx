import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useState } from "react";
import { Form, Input, Button, Card, Row, Col, DatePicker, Select, Typography, message } from "antd";
import LocationMap from '../common/MapComponent';
import languages  from '../../assets/constants/Languages';
import AccessibilityTags from '../../assets/constants/AccessibiltyTags';
import ActivitySelectionModal from '../itinerary/ActivitySelectionModal';
import { createItinerary } from '../../api/ItineraryService';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function CreateItineraryForm() {
    const [loading, setLoading] = useState(false);
    const [pickupLocation, setPickUpLocation] = useState(null);
    const [dropoffLocation, setDropOffLocation] = useState(null);
    const [pickupMarkerPosition, setPickUpMarkerPosition] = useState([51.505, -0.09]);
    const [dropoffMarkerPosition, setDropOffMarkerPosition] = useState([51.505, -0.09]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [numDays, setNumDays] = useState(0); // Store the number of days
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const [form] = Form.useForm();

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
        if(values.availableDate[0].isBefore(new Date(), "day") || values.availableDate[1].isBefore(new Date(), "day")){
            return message.error("Please enter future dates for the itinerary.");
        }
        if(!selectedActivities || selectedActivities.length === 0){
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
        }finally{
            setLoading(false);
        }
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
                      <RangePicker style={{ width: "100%"}} size="large" onChange={handleDateChange}/>
                    </Form.Item>

                    <Form.Item>
                    <Button style={{
                        color: "black",
                        borderColor: '',
                        ':hover': { borderColor: "#5a9ea0" },
                        ':select': { borderColor: "#5a9ea0" },
                    }}onClick={() => setIsModalVisible(true)}>
                        Select Activities ({numDays} Days)
                    </Button>
                    <ActivitySelectionModal
                        isVisible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        onSelectActivities={handleSelectActivities}
                        preSelectedActivities={selectedActivities}
                        maxActivities={numDays}
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
                          <Input prefix="$" size="large" placeholder="0"/>
                        </Form.Item>
                      </Col>
            
                      <Col span={12}>
                        {/* Language */}
                        <Form.Item
                          label="Language"
                          name="language"
                          rules={[{ required: true, message: "Please select a language" }]}
                        >
                          <Select placeholder="Select language" size="large" style={{
                            borderColor: "#e0829d",
                            ':hover': { borderColor: "#e0829d" },
                            ':focus': { borderColor: "#e0829d" },
                        }}>
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
                        placeholder="Enter tags and press Enter"
                        size="large"
                        style={{
                            width: "100%",
                            borderColor: "#5a9ea0",
                            ':hover': { borderColor: "#5a9ea0" },
                            ':focus': { borderColor: "#5a9ea0" },
                        }}>
                        {AccessibilityTags.map((accessibility) => (
                            <Option key={accessibility} value={accessibility}>
                              {accessibility}
                            </Option>
                          ))}
                        </Select>
                    </Form.Item>

                    {/* Locations */}
                    <Form.Item
                      label="Pickup Location"
                      name="pickupLocation"
                      rules={[{ required: !pickupLocation, message: "Please enter a Pickup Location" }]}
                    >
                    <LocationMap
                        markerPosition={pickupMarkerPosition}
                        setMarkerPosition={setPickUpMarkerPosition}
                        setSelectedLocation={setPickUpLocation}
                        selectedLocation = {pickupLocation}
                    /></Form.Item>
                    <Form.Item
                      label="Drop Off Location"
                      name="dropoffLocation"
                      rules={[{ required: !dropoffLocation, message: "Please enter a Drop off Location" }]}
                    >
                    <LocationMap
                        markerPosition={dropoffMarkerPosition}
                        setMarkerPosition={setDropOffMarkerPosition}
                        setSelectedLocation={setDropOffLocation}
                        selectedLocation = {dropoffLocation}
                    /></Form.Item>


                    {/* Submit Button */}
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="custom-button"
                        style={{ width: "100%", height: "50px" }}
                        onClick={handleSubmit}
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

                    /* Apply border color globally for hover and focus states */
            .ant-input:hover, .ant-input:focus, 
            .ant-select-selector:hover, .ant-select-selector:focus, 
            .ant-picker:hover, .ant-picker:focus {
                border-color: #5a9ea0 !important;
                box-shadow: none !important; /* Optional: Disable default shadow */
            }

            /* For error state (red border), you can override this too */
            .ant-input-status-error:hover, .ant-input-status-error:focus,
            .ant-select-selector-status-error:hover, .ant-select-selector-status-error:focus,
            .ant-picker-status-error:hover, .ant-picker-status-error:focus {
                border-color: #5a9ea0 !important;
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