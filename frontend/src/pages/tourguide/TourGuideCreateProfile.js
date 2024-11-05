import React, { useState, useEffect } from "react";
import { getProfileData, updateProfile } from "../../api/TourGuideService";
import { useParams, useNavigate } from "react-router-dom";
import languages from "../../assets/constants/Languages";
import { nationalities } from "../../assets/Nationalities";
import moment from "moment";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  message,
  Card,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TourguideNavBar from "../../components/navbar/TourguideNavBar"; // Ensure this import is correct

const { Option } = Select;

const TourGuideCreateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    initialEmail: "",
    initialName: "",
    initialMobileNumber: "",
    initialNationality: "",
    initialYearsOfExperience: 0,
    initialLanguagesSpoken: [],
    initialEducation: [],
    initialPreviousWork: [],
    initialProfilePicture: "",
    name: "",
    email: "",
    mobileNumber: "",
    nationality: "",
    yearsOfExperience: 0,
    languagesSpoken: [],
    education: [],
    previousWork: [],
    profilePicture: "",
  });

  const [form] = Form.useForm();

  useEffect(() => {
    const getTourGuideData = async () => {
      try {
        setLoading(true);
        const profileData = await getProfileData(id);
        const data = profileData.data;
        for (let i = 0; i < data.previousWork.length; i++) {
          data.previousWork[i].startDate = moment(
            data.previousWork[i].startDate
          ).isValid()
            ? moment(data.previousWork[i].startDate)
            : null;
          data.previousWork[i].endDate = moment(
            data.previousWork[i].endDate
          ).isValid()
            ? moment(data.previousWork[i].endDate)
            : null;
        }
        setFormData({
          initialEmail: data.email || "",
          initialName: data.name || "",
          initialMobileNumber: data.mobileNumber || "",
          initialNationality: data.nationality || "",
          initialYearsOfExperience: data.yearsOfExperience || 0,
          initialLanguagesSpoken: data.languagesSpoken || [],
          initialEducation: data.education || [],
          initialPreviousWork: data.previousWork || [],
          initialProfilePicture: data.profilePicture || "",
          profilePicture: data.currProfilePicture || "",
          ...data,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Failed to fetch profile data");
      }
    };

    getTourGuideData();
  }, [id]);

  useEffect(() => {
    form.setFieldsValue({
      email: formData.initialEmail,
      name: formData.initialName,
      mobileNumber: formData.initialMobileNumber,
      yearsOfExperience: formData.initialYearsOfExperience,
      nationality: formData.initialNationality,
      languagesSpoken: formData.initialLanguagesSpoken,
      education: formData.initialEducation,
      previousWork: formData.initialPreviousWork,
    });
  }, [formData, form]);

  const handleSubmit = async (e) => {
    setLoading(true);

    let hasChanges = false;

    const changedFields = {};
    for (const key in formData) {
      if (key.startsWith("initial")) continue;
      const initialKey = `initial${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (formData[key] !== formData[initialKey]) {
        hasChanges = true;
        changedFields[key] = formData[key];
        if (key === "profilePicture")
          changedFields["initialProfilePicture"] =
            formData["initialProfilePicture"];
      }
    }

    if (!hasChanges) {
      message.warning(
        "At least one field must be edited to update the product."
      );
      setLoading(false);
      return;
    }

    try {
      await updateProfile(id, changedFields);
      message.success("Profile updated successfully!");
      navigate(`/tourguide/${id}`);
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TourguideNavBar />
      <div class="w-1/2 mx-auto mt-2 mb-5 ">
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ width: "100%" }}
          autoComplete="off"
          onValuesChange={(changedValues, allValues) => {
            setFormData((oldData) => ({
              ...oldData,
              ...changedValues,
              education: allValues.education,
              previousWork: {
                ...allValues.previousWork,
                startDate: allValues?.previousWork?.startDate?.toISOString(),
                endDate: allValues?.previousWork?.endDate?.toISOString(),
              },
            }));
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: formData.email === "",
                type: "email",
                message: "Please enter your email",
              },
            ]}
          >
            <Input style={{ width: "100%" }} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: formData.name === "",
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Enter your name"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="mobileNumber"
            rules={[
              {
                required: formData.mobileNumber === "",
                message: "Please input your mobile number!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Enter your mobile number"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Years of Experience"
            name="yearsOfExperience"
            rules={[
              {
                required: formData.yearsOfExperience === 0,
                message: "Please input your years of experience!",
              },
            ]}
          >
            <InputNumber
              placeholder="Enter experience years"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="nationality"
            label="Nationality"
            rules={[
              {
                required: formData.nationality === "",
                message: "Please select your nationality!",
              },
            ]}
          >
            <Select>
              {nationalities.map((nationality) => (
                <Select.Option value={nationality}>{nationality}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="languagesSpoken"
            label="Select Languages"
            rules={[
              {
                required: formData.languagesSpoken?.length === 0,
                message: "Please select your languages!",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Please select spoken languages"
            >
              {languages.map((language) => (
                <Option key={language} value={language}>
                  {language}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.List name="education">
            {(fields, { add: addEducation, remove: removeEducation }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Card
                    title={`Education ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          removeEducation(field.name);
                        }}
                      />
                    }
                  >
                    <Form.Item
                      label="Degree"
                      name={[field.name, "degree"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your degree!",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Institution"
                      name={[field.name, "institution"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your institution!",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Year Of Completion"
                      name={[field.name, "yearOfCompletion"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your Year Of Completion!",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => addEducation()} block>
                  + Add Education
                </Button>
              </div>
            )}
          </Form.List>
          <Form.List name="previousWork">
            {(fields, { add: addPrevWork, remove: removePrevWork }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Card
                    title={`Previous Work ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          removePrevWork(field.name);
                        }}
                      />
                    }
                  >
                    <Form.Item
                      label="Company Name"
                      name={[field.name, "companyName"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your company name!",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Position"
                      name={[field.name, "position"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your position!",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Location"
                      name={[field.name, "location"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter company location!",
                        },
                      ]}
                    >
                      <Input
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Start Date"
                      name={[field.name, "startDate"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter working start date !",
                        },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      label="End date"
                      name={[field.name, "endDate"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter working end date!",
                        },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      label="Description"
                      name={[field.name, "description"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter your job description!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => addPrevWork()} block>
                  + Add previous work experience
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default TourGuideCreateProfile;
