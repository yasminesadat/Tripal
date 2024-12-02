import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { tourismGovernerID } from "../../IDs";
import { Form, Upload, Select, TimePicker, Input, InputNumber, Button } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import MapPopUp from "../../components/common/MapPopUp";
import { getAllPeriodTags } from '../../api/HistoricalPlacePeriodService';
import { getAllTypeTags } from '../../api/HistoricalPlaceTagService';
import { useLocation } from 'react-router-dom';
import GovernorNavBar from '../../components/navbar/GovernorNavBar';
import moment from 'moment';
import { toast } from "react-toastify";
import { CreateNewHistoricalPlace, updateHistoricalPlace } from '../../api/HistoricalPlaceService';
const HistoricalPlaceForm = () => {
    const location = useLocation();
    const props = location.state?.place;
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(props?.location?.address || "");
    const [tagsOptions, setTagsOption] = useState([]);
    const [periodTagsOptions, setPeriodTagsOption] = useState([]);
    const [deletedImages, setDeletedImages] = useState(new Set([]));
    const [newImages, setNewImages] = useState(new Set([]));
    const [coordinates, setCoordinates] = useState([
        props?.location?.coordinates?.latitude || 51.505,
        props?.location?.coordinates?.longitude || -0.09,
    ]);
    const [formData, setFormData] = useState({
        tourismGovernor: tourismGovernerID,
        name: props?.name || "",
        description: props?.description || "",
        images: new Set(props?.images || []),
        openingHours: {
            weekdays: {
                openingTime: props?.openingHours?.weekdays?.openingTime || '',
                closingTime: props?.openingHours?.weekdays?.closingTime || '',
            },
            weekends: {
                openingTime: props?.openingHours?.weekends?.openingTime || '',
                closingTime: props?.openingHours?.weekends?.closingTime || '',
            }
        },
        ticketPrices: {
            foreigner: props?.ticketPrices?.foreigner || 0,
            native: props?.ticketPrices?.native || 0,
            student: props?.ticketPrices?.student || 0,
        },
        tags: props?.tags || [],
        historicalPeriod: props?.historicalPeriod || []
    });
    const handleChoosingImage = (e) => {
        e.fileList.forEach(file => {
            if (file.status !== 'done') {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onloadend = () => {
                    setNewImages((oldImages) => new Set(oldImages).add(
                        reader.result
                    ))

                }
            }
        });
    }
    useEffect(() => {
        const getHistoricalPeriods = async () => {
            setLoading(true);
            const PeriodTagsData = await getAllPeriodTags();
            if (PeriodTagsData) {
                setPeriodTagsOption(PeriodTagsData);
            }
            setLoading(false);
        };
        getHistoricalPeriods();
    }, []);
    useEffect(() => {
        const getHistoricalTags = async () => {
            setLoading(true);
            const typeTagsData = await getAllTypeTags();
            if (typeTagsData) {
                setTagsOption(typeTagsData);
            }
            setLoading(false);
        };
        getHistoricalTags();
    }, [])


    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    async function handleSubmission() {
        console.log("ia m hereee")
        const newHistoricalPlace = {
            tourismGovernor: tourismGovernerID
            ,
            name: formData.name
            ,
            description: formData.description,
            images: [...newImages],
            location: {
                address: address,
                coordinates: {
                    latitude: Number(coordinates[0]),
                    longitude: Number(coordinates[1]),
                }
            },
            openingHours: {
                weekdays: {
                    openingTime: (formData.openingHours.weekdays.openingTime).toString(),
                    closingTime: (formData.openingHours.weekdays.closingTime).toString(),

                },
                weekends: {
                    openingTime: (formData.openingHours.weekends.openingTime).toString(),
                    closingTime: (formData.openingHours.weekends.closingTime).toString(),
                },
            },
            ticketPrices: {
                foreigner: formData.ticketPrices.foreigner,
                native: formData.ticketPrices.native,
                student: formData.ticketPrices.student
            },
            tags: await formData.tags,
            historicalPeriod: await formData.historicalPeriod,
        };
        setLoading(true);
        console.log("historical Places", newHistoricalPlace);
        if (id === undefined) {
            try {
                const result = await CreateNewHistoricalPlace(newHistoricalPlace);
                if (result) {
                    setLoading(false);
                    toast.success('Historical place created successfully')
                }
            }
            catch (err) {
                toast.error(err);
                setLoading(false);
            }
        }
        else {
            try {
                const updatedHistoricalPlace = {
                    tourismGovernor: tourismGovernerID
                    ,
                    name: formData.name
                    ,
                    description: formData.description,
                    images: [...newImages],
                    location: {
                        address: address,
                        coordinates: {
                            latitude: Number(coordinates[0]),
                            longitude: Number(coordinates[1]),
                        }
                    },
                    openingHours: {
                        weekdays: {
                            openingTime: (formData.openingHours.weekdays.openingTime).toString(),
                            closingTime: (formData.openingHours.weekdays.closingTime).toString(),

                        },
                        weekends: {
                            openingTime: (formData.openingHours.weekends.openingTime).toString(),
                            closingTime: (formData.openingHours.weekends.closingTime).toString(),
                        },
                    },
                    ticketPrices: {
                        foreigner: formData.ticketPrices.foreigner,
                        native: formData.ticketPrices.native,
                        student: formData.ticketPrices.student
                    },
                    tags: await formData.tags,
                    historicalPeriod: await formData.historicalPeriod,
                    deletedImages: [...deletedImages]
                }
                console.log("in update ", updatedHistoricalPlace);
                const result = await updateHistoricalPlace(id, updatedHistoricalPlace);
                if (result) {
                    setLoading(false);
                    toast.success('Historical place Updated successfully')
                }

            } catch (err) {
                toast.error(err);
                setLoading(false);
            }
        }
    }
    const handleInputChange = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const fileList = [...formData.images].map((image, index) => ({
        uid: image.public_id,
        name: `image-${index + 1}.png`,
        status: 'done',
        url: image.url,
    }));

    return (
        <div>
            <GovernorNavBar />
            {id === undefined && <h2 >Create new historical place</h2>}
            {id !== undefined && <h2 >Update historical place</h2>
            }
            <Form
                layout="vertical"
                name="validate_other"
                onFinish={handleSubmission}
                initialValues={{
                    upload: fileList,
                }}
            >

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: id === undefined,
                            message: 'Please enter the place name!',
                        },
                    ]}
                >
                    <Input style={{
                        width: '100%',
                    }} name="name"
                        type="text"
                        value={formData.name}
                        placeholder="Enter historical place name"
                        onChange={handleInputChange}
                        defaultValue={formData.name}
                    />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: id === undefined,
                            message: 'Please enter the place description!',
                        },
                    ]}
                >
                    <Input style={{
                        width: '100%',
                    }} name="description"
                        type="text"
                        value={formData.description}
                        placeholder="Enter historical place description"
                        onChange={handleInputChange}
                        defaultValue={formData.description} />
                </Form.Item>
                <Form.Item name="weekendOpeningTime" label="Weekends opening time" rules={[
                    {
                        type: 'object',
                        required: id === undefined,
                        message: 'Please select weekends opening time!',
                    },
                ]}>
                    <TimePicker style={{
                        width: '100%',
                    }}
                        name="weekendOpeningTime"
                        value={formData.openingHours?.weekends?.openingTime
                            ? moment(formData.openingHours.weekends.openingTime, 'HH:mm')
                            : null}
                        onChange={(time, timeString) => {
                            setFormData((data) => ({
                                ...data,
                                openingHours: {
                                    ...data.openingHours,
                                    weekends: {
                                        ...data.openingHours.weekends,
                                        openingTime: timeString,
                                    },
                                },
                            }))
                        }}
                        defaultValue={formData.openingHours.weekends.openingTime ? moment(formData.openingHours.weekends.openingTime, "HH:mm") : null}
                        placeholder="please select the weekends opening time" />
                </Form.Item>
                <Form.Item name="weekendClosingTime" label="Weekends closing time" rules={[
                    {
                        type: 'object',
                        required: id === undefined,
                        message: 'Please select weekends closing time!',
                    },
                ]}>
                    <TimePicker style={{
                        width: '100%',
                    }} name="weekendClosingTime"
                        value={formData.openingHours?.weekends?.closingTime
                            ? moment(formData.openingHours.weekends.closingTime, 'HH:mm')
                            : null}
                        onChange={(time, timeString) => {
                            setFormData((data) => ({
                                ...data,
                                openingHours: {
                                    ...data.openingHours,
                                    weekends: {
                                        ...data.openingHours.weekends,
                                        closingTime: timeString,
                                    },
                                },
                            }))
                        }}
                        defaultValue={formData.openingHours.weekends.closingTime ? moment(formData.openingHours.weekends.closingTime, "HH:mm") : null}
                        placeholder="please select the weekends closing time" />
                </Form.Item>
                <Form.Item name="weekdayOpeningTime" label="Weekdays opening time" rules={[
                    {
                        type: 'object',
                        required: id === undefined,
                        message: 'Please select weekdays opening time!',
                    },
                ]}>
                    <TimePicker style={{
                        width: '100%',
                    }} name="weekdayOpeningTime"
                        value={formData.openingHours?.weekdays?.openingTime
                            ? moment(formData.openingHours.weekdays.openingTime, 'HH:mm')
                            : null}
                        onChange={(time, timeString) => {
                            setFormData((data) => ({
                                ...data,
                                openingHours: {
                                    ...data.openingHours,
                                    weekdays: {
                                        ...data.openingHours.weekdays,
                                        openingTime: timeString,
                                    },
                                },
                            }))
                        }}
                        defaultValue={formData.openingHours.weekdays.openingTime ? moment(formData.openingHours.weekdays.openingTime, "HH:mm") : null}
                        placeholder="please select the weekdays opening time" />
                </Form.Item>
                <Form.Item name="weekdayClosingTime" label="Weekday closing time" rules={[
                    {
                        type: 'object',
                        required: id === undefined,
                        message: 'Please select weekdays closing time!',
                    },
                ]}>
                    <TimePicker style={{
                        width: '100%',
                    }} name="weekdayClosingTime"
                        value={formData.openingHours?.weekdays?.closingTime
                            ? moment(formData.openingHours.weekdays.closingTime, 'HH:mm')
                            : null}
                        onChange={(time, timeString) => {
                            setFormData((data) => ({
                                ...data,
                                openingHours: {
                                    ...data.openingHours,
                                    weekdays: {
                                        ...data.openingHours.weekdays,
                                        closingTime: timeString,
                                    },
                                },
                            }))
                        }}
                        defaultValue={formData.openingHours.weekdays.closingTime ? moment(formData.openingHours.weekdays.closingTime, "HH:mm") : null}
                        placeholder="please select the weekdays closing time" />

                </Form.Item>
                <Form.Item
                    label="Historical Periods"
                    name="historicalPeriod"
                    rules={[{ required: false, message: "Please select or create historical periods" }]}>
                    <Select
                        mode="tags"
                        placeholder="Please select or create period tags"
                        defaultValue={[...formData.historicalPeriod.map((period) => ({
                            label: period.name,
                            value: period._id
                        }))]}
                        onChange={(selectedTags) => {
                            console.log("helo", selectedTags);
                            const selectedPeriods = selectedTags.map((tagValue) => {
                                const period = periodTagsOptions.find((p) => p._id === tagValue);
                                return {
                                    name: period ? period.name : tagValue,
                                    _id: period ? period._id : ''
                                };
                            });
                            console.log(selectedPeriods);
                            setFormData((data) => ({
                                ...data,
                                historicalPeriod: selectedPeriods,
                            }));
                        }}
                        style={{
                            width: '100%',
                        }}
                        options={periodTagsOptions.map((period) => (
                            {
                                label: period.name,
                                value: period._id
                            }
                        )
                        )}
                    />
                </Form.Item>
                <Form.Item
                    label="Tags"
                    name="tags"
                    rules={[{ required: false, message: "Please select or create tags" }]}>
                    <Select
                        mode="tags"
                        placeholder="Please select or new tags"
                        defaultValue={[...formData.tags.map((tag) => ({
                            label: tag.name,
                            value: tag._id
                        }))]}
                        onChange={(selectedTags) => {
                            console.log("helo", selectedTags);
                            const tags = selectedTags.map((tagValue) => {
                                const tag = tagsOptions.find((p) => p._id === tagValue);
                                return {
                                    name: tag ? tag.name : tagValue,
                                    _id: tag ? tag._id : ''
                                };
                            });
                            console.log(tags);
                            setFormData((data) => ({
                                ...data,
                                tags: tags,
                            }));
                        }}
                        style={{
                            width: '100%',
                        }}
                        options={tagsOptions.map((tag) => (
                            {
                                label: tag.name,
                                value: tag._id,
                            }
                        )
                        )}
                    />
                </Form.Item>
                <Form.Item
                    label="Foreigner ticket Price"
                    name="foreignerPrice"
                    rules={[{ required: id === undefined, message: "Please enter the foreigner ticket price" }]}
                >
                    <InputNumber
                        min={0}
                        defaultValue={id !== undefined ? formData.ticketPrices.foreigner : null}
                        value={formData.ticketPrices.foreigner}
                        onChange={(value) => (setFormData((data) => ({
                            ...data,
                            ticketPrices: {
                                ...data.ticketPrices,
                                foreigner: value,
                            }
                        })))}
                        placeholder="Enter foreigner ticket price"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Native ticket Price"
                    name="nativePrice"
                    rules={[{ required: id === undefined, message: "Please enter the native ticket price" }]}
                >
                    <InputNumber
                        min={0}
                        defaultValue={id !== undefined ? formData.ticketPrices.native : null}
                        value={formData.ticketPrices.native}
                        onChange={(value) => (setFormData((data) => ({
                            ...data,
                            ticketPrices: {
                                ...data.ticketPrices,
                                native: value,
                            }
                        })))}
                        placeholder="Enter native ticket price"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Student ticket Price"
                    name="studentPrice"
                    rules={[{ required: id === undefined, message: "Please enter the student ticket price" }]}
                >
                    <InputNumber
                        min={0}
                        defaultValue={id !== undefined ? formData.ticketPrices.student : null}
                        value={formData.ticketPrices.student}
                        onChange={(value) => (setFormData((data) => ({
                            ...data,
                            ticketPrices: {
                                ...data.ticketPrices,
                                student: value,
                            }
                        })))}
                        placeholder="Enter student ticket price"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="upload"
                    label="Upload place images"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra="You can select one or more images"

                >
                    <Upload.Dragger
                        name="files"
                        multiple
                        onChange={handleChoosingImage}
                        onRemove={(file) => {
                            console.log("the file to be removed", file);
                            if ('url' in file) {
                                setDeletedImages((oldImages) => new Set([...oldImages]).add({
                                    public_id: file.uid,
                                    url: file.url,
                                }))
                                console.log("deleted images set", deletedImages)
                            } else {
                                setNewImages((oldData) => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file.originFileObj);
                                    reader.onloadend = () => {
                                        const encodedImage = reader.result;
                                        return new Set([...oldData].filter((image) => image !== encodedImage))
                                    }
                                });
                                console.log("the new images set", newImages)
                            }
                        }}
                        listType="picture">
                        <p >
                            <InboxOutlined />
                        </p>
                        <p >Click or drag files to this area to upload</p>
                        <p >
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.
                        </p>
                    </Upload.Dragger>
                </Form.Item>
                <Form.Item>
                    <MapPopUp
                        markerPosition={coordinates}
                        setMarkerPosition={setCoordinates}
                        setSelectedLocation={setAddress}
                        selectedLocation={address} />
                </Form.Item>
                <div style={{ marginTop: '10px' }}>
                    <strong>Selected Location:</strong> {address || 'No location selected yet'}
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={loading}
                >
                    {id === undefined ? "Create" : "Update"}

                </Button>
            </Form>
        </div>
    );
}
export default HistoricalPlaceForm;








