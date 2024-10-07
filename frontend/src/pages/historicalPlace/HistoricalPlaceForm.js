import React from 'react';
import { useState, useEffect } from 'react';
import { CreateNewHistoricalPlace, getHistoricalPlaceDetails, updateHistoricalPlace } from '../../api/HistoricalPlaceService';
import { getAllPeriodTags, CreateNewPeriodTag } from '../../api/HistoricalPlacePeriodService';
import { getAllTypeTags, CreateNewTypeTag } from '../../api/HistoricalPlaceTagService';
import { toast } from 'react-toastify';
import { Form, Input, Select, Button, message, Upload, InputNumber, TimePicker } from "antd";
import Maps from '../../components/HistPlaceMap/Maps';
import SearchBox from '../../components/HistPlaceMap/SearchBox';
import moment from 'moment';
import { tourismGovernerID } from '../../IDs';
import { InboxOutlined } from '@ant-design/icons';
import { useParams, useLocation, useNavigate } from "react-router-dom";

function HistoricalPlaceForm({ state }) {
    const { id } = useParams();
    const isCreate = id === undefined;
    const [form] = Form.useForm();
    const [selectPosition, setSelectPosition] = useState(null);
    const [selectLocation, setSelectLocation] = useState(null);
    const [searchPlaceHolder, setSearchPlaceHolder] = useState(null);

    const [histDetails, setHistDetails] = useState(null);
    const [images, setImages] = useState(new Set());
    const [encodedImages, setEncodedImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [periodTags, setPeriodTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tagsOptions, setTagsOption] = useState([]);
    const [periodTagsOptions, setPeriodTagsOption] = useState([]);
    const location = useLocation();
    const passedData = location.state?.place;
    const [formData, setFormData] = useState({
        name: passedData ? passedData.name : "",
        description: passedData ? passedData.description : "",
        weekdayOpening: passedData ? passedData.openingHours.weekdays.openingTime : "",
        weekdayClosing: passedData ? passedData.openingHours.weekdays.closingTime : "",
        weekendOpening: passedData ? passedData.openingHours.weekends.openingTime : "",
        weekendClosing: passedData ? passedData.openingHours.weekends.closingTime : "",
        foreignerPrice: passedData ? passedData.ticketPrices.foreigner : 0,
        nativePrice: passedData ? passedData.ticketPrices.native : 0,
        studentPrice: passedData ? passedData.ticketPrices.student : 0,
    });
    useEffect(() => {
        setTags(passedData ? passedData.tags : [])
        // console.log("TAGS I GOT", passedData.tags)
        setPeriodTags(passedData ? passedData.historicalPeriod : [])
        setSelectPosition(passedData ? { lat: passedData.location.coordinates.latitude ? passedData.location.coordinates.latitude : '-77.0364', lon: passedData.location.coordinates.longitude ? passedData.location.coordinates.longitude : '-77.0364' } : null)
        setSelectLocation(passedData ? passedData.location.address : '');
        console.log("passed", passedData)

    }, [passedData]);

    // useEffect(() => {
    //     const fetchHistoricalPlaceDetails = async (historicalPlaceId) => {
    //         setLoading(true);
    //         console.log(id);
    //         const HistoricalPlaceData = await getHistoricalPlaceDetails(historicalPlaceId);
    //         const data=await HistoricalPlaceData.data;
    //         setHistDetails(data);
    //         form.setFieldsValue(data);
    //         console.log(data);
    //         setLoading(false);
    //     };
    //     if (id!==undefined) {
    //         fetchHistoricalPlaceDetails(id);
    //     };
    // }, []);
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


    // const handleChoosingImage = (e) => {
    //     const files = e.target.files;
    //     Array.from(files).forEach((file) => {
    //         setFileToBase(file).then((encodedImage) => {
    //             setImages((prevImages) => [...prevImages, encodedImage]);
    //         });
    //     });
    //     console.log(images);
    // };
    // const setFileToBase = (file) => {
    //     return new Promise((resolve) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onloadend = () => {
    //             resolve(reader.result);
    //         };
    //     });
    // };
    const handleChoosingImage = (e) => {
        const files = e.fileList.map((file) => file.originFileObj);
        files.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImages((oldImages) => new Set(oldImages).add(reader.result));
                console.log(images);
            }
        });
        console.log(images);
    }
    async function createTags() {
        const tagID = [];
        const tagsIDs = tagsOptions.map((tag) => tag._id);
        const tagsNames = tagsOptions.map((tag) => tag.name);

        const tagPromises = tags.map(async (tag) => {
            if (!tagsIDs.includes(tag.toString()) && !tagsNames.includes(tag.toString())) {
                const response = await CreateNewTypeTag({ name: tag.toString() });
                const responseJSON = await response.data;
                tagID.push(responseJSON._id);
            } else {
                tagID.push(tag);
            }
            console.log("inside function createTags", tagID)
        });
        await Promise.all(tagPromises);  // Wait for all async tag creations
        setTags(tagID);  // Set the tags after all have been processed
        console.log("tag ids after setting:", tagID);
    }
    async function createPeriodTags() {
        let periodTagID = [];
        const periodTagsIDs = periodTagsOptions.map((periodtag) => periodtag._id);
        const periodTagsNames = periodTagsOptions.map((periodtag) => periodtag.name);

        const periodTagPromises = periodTags.map(async (periodTag) => {
            if (!periodTagsIDs.includes(periodTag.toString()) && !periodTagsNames.includes(periodTag.toString())) {
                const response = await CreateNewPeriodTag({ name: periodTag.toString() });
                const responseJSON = await response.data;
                periodTagID.push(responseJSON._id);
            } else {
                periodTagID.push(periodTag);
            }
        });

        await Promise.all(periodTagPromises);  // Wait for all async period tag creations
        setPeriodTags(periodTagID);  // Set the period tags after all have been processed
        console.log(periodTagID);
    }

    async function handleSubmition() {
        console.log("tags before waiting", tags)
        await createTags();

        // await createPeriodTags();

        console.log("tags after waiting", tags)
        const newHistoricalPlace = {
            tourismGovernor: tourismGovernerID
            ,
            name: formData.name
            ,
            description: formData.description,
            images: [...images],
            location: {
                address: selectLocation.toString(),
                coordinates: {
                    latitude: Number(selectPosition?.lat),
                    longitude: Number(selectPosition?.lon),
                }
            },
            openingHours: {
                weekdays: {
                    openingTime: formData.weekdayOpening.toString(),
                    closingTime: formData.weekdayClosing.toString(),

                },
                weekends: {
                    openingTime: formData.weekendOpening.toString(),
                    closingTime: formData.weekendClosing.toString(),
                },
            },
            ticketPrices: {
                foreigner: formData.foreignerPrice,
                native: formData.nativePrice,
                student: formData.studentPrice
            },
            tags: await tags,
            historicalPeriod: await periodTags,
        };
        setLoading(true);
        console.log("historical Places", newHistoricalPlace);
        // console.log("Im ")
        if (id === undefined) {
            try {
                const result = await CreateNewHistoricalPlace(newHistoricalPlace);
                if (result) {
                    setLoading(false);
                    toast.success('Historical place created successfully')
                    setImages([]);
                    setFormData({
                        name: '',
                        description: '',
                        weekdayOpening: '',
                        weekdayClosing: '',
                        weekendOpening: '',
                        weekendClosing: '',
                        foreignerPrice: '',
                        nativePrice: '',
                        studentPrice: '',
                    });
                    setTags([]);
                    setPeriodTags([]);
                    setSelectPosition(null);
                }
            }
            catch (err) {
                toast.error(err);
                setLoading(false);
            }
        }
        else {
            try {
                const result = await updateHistoricalPlace(id, newHistoricalPlace);
                if (result) {
                    setLoading(false);
                    toast.success('Historical place Updated successfully')
                    setImages([]);
                    setFormData({
                        name: '',
                        description: '',
                        weekdayOpening: '',
                        weekdayClosing: '',
                        weekendOpening: '',
                        weekendClosing: '',
                        foreignerPrice: '',
                        nativePrice: '',
                        studentPrice: '',
                    });
                    setTags([]);
                    setPeriodTags([]);
                    setSelectPosition(null);
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
    const handleTime = (field, time) => {
        setFormData({ ...formData, [field]: time.format("HH:mm") });
    }
    const handlePrices = (field, price) => {
        setFormData({ ...formData, [field]: price });
        console.log(formData);
    }
    return (
        <div>
            {id === undefined && <h2 >Create new historical place</h2>}
            {id !== undefined && <h2 >Update historical place</h2>
            }
            <Form form={form} layout="vertical" onFinish={handleSubmition}
                initialValues={{
                    name: formData.name,
                    description: formData.description,
                    weekdayOpening: formData.weekdayOpening ? moment(formData.weekdayOpening, "HH:mm") : null,
                    weekdayClosing: formData.weekdayClosing ? moment(formData.weekdayClosing, "HH:mm") : null,
                    weekendOpening: formData.weekendOpening ? moment(formData.weekendOpening, "HH:mm") : null,
                    weekendClosing: formData.weekendClosing ? moment(formData.weekendClosing, "HH:mm") : null,
                    foreignerPrice: formData.foreignerPrice,
                    nativePrice: formData.nativePrice,
                    studentPrice: formData.studentPrice,
                    tags: tags.map((tag) => tag.name),
                    periods: periodTags
                }}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: id === undefined, message: "Please enter the name of the place" }]}
                >
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter historical place name"
                    />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: id === undefined, message: "Please enter the description of the historical place" }]}
                >
                    <Input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter historical place decription"
                    />
                </Form.Item>
                <Form.Item
                    label="Weekend Opening Time"
                    name="weekendOpening"
                    rules={[{ required: isCreate, message: "Please enter the weekend opening time" }]}
                >
                    <TimePicker
                        format="HH:mm"
                        value={(formData.weekendOpening ? moment(formData.weekendOpening, "HH:mm") : null)}
                        onChange={(time) => handleTime('weekendOpening', time)}
                        placeholder="Select weekend opening time"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Weekend Closing Time"
                    name="weekendClosing"
                    rules={[{ required: id === undefined, message: "Please enter the weekend closing time" }]}
                >
                    <TimePicker
                        format="HH:mm"
                        value={formData.weekendClosing ? moment(formData.weekendClosing, "HH:mm") : null}
                        onChange={(time) => handleTime('weekendClosing', time)}
                        placeholder="Select weekend Closing time"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Weekdays Opening Time"
                    name="weekdayOpening"
                    rules={[{ required: id === undefined, message: "Please enter the weekdays opening time" }]}
                >
                    <TimePicker
                        format="HH:mm"
                        value={formData.weekdayOpening ? moment(formData.weekdayOpening, "HH:mm") : null}
                        onChange={(time) => handleTime('weekdayOpening', time)}
                        placeholder="Select weekdays opening time"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Weekdays Closing Time"
                    name="weekdayClosing"
                    rules={[{ required: id === undefined, message: "Please enter the weekdays closing time" }]}
                >
                    <TimePicker
                        format="HH:mm"
                        value={formData.weekdayClosing ? moment(formData.weekdayClosing, "HH:mm") : null}
                        onChange={(time) => handleTime('weekdayClosing', time)}
                        placeholder="Select weekdays closing time"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Tags"
                    name="tags"
                    rules={[{ required: false, message: "Please select or create tags" }]}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Select or create tags"
                        value={tags}
                        onChange={(selectedTags) => setTags(selectedTags)}
                        options={tagsOptions.map(tag => ({
                            label: tag.name,
                            value: tag._id
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Periods tags"
                    name="periods"
                    rules={[{ required: false, message: "Please select or create period tags" }]}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Select or create period tags"
                        value={periodTags}
                        onChange={(selectedPeriodTags) => {
                            setPeriodTags(selectedPeriodTags);
                        }}
                        options={periodTagsOptions.map(period => ({
                            label: period.name,
                            value: period._id
                        }))}
                    /></Form.Item>
                <Form.Item
                    label="Foreigner Price"
                    name="foreignerPrice"
                    rules={[{ required: id === undefined, message: "Please enter the foreigner ticket price" }]}
                >
                    <InputNumber
                        min={0}
                        value={formData.foreignerPrice}
                        onChange={(value) => { handlePrices('foreignerPrice', value) }}
                        placeholder="Enter foreigner ticket price"
                        style={{ width: '100%' }}
                    />
                </Form.Item>


                <Form.Item
                    label="Native Price"
                    name="nativePrice"
                    rules={[{ required: id === undefined, message: "Please enter the native ticket price" }]}
                >
                    <InputNumber
                        min={0}
                        value={formData.nativePrice}
                        onChange={(value) => { handlePrices('nativePrice', value) }}
                        placeholder="Enter native ticket price"
                        style={{ width: '100%' }}
                    />
                </Form.Item>


                <Form.Item
                    label="Student Price"
                    name="studentPrice"
                    rules={[{ required: id === undefined, message: "Please enter the student ticket price" }]}
                >
                    <InputNumber
                        min={0}
                        value={formData.studentPricePrice}
                        onChange={(value) => { handlePrices('studentPrice', value) }}
                        placeholder="Enter student ticket price"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    label="Upload Images for the Place"
                    name="images"
                    rules={[{ required: false, message: "Please upload at least one image" }]}
                >
                    <Upload.Dragger
                        name="files"
                        multiple
                        beforeUpload={() => false}
                        onChange={handleChoosingImage}
                        showUploadList={true}
                    >
                        <p >
                            <InboxOutlined />
                        </p>
                        <p >Click or drag files to this area to upload</p>
                        <p >
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.
                        </p>
                    </Upload.Dragger>
                </Form.Item>

                <SearchBox
                    selectPosition={selectPosition}
                    setSelectPosition={setSelectPosition}
                    setSelectLocation={setSelectLocation}
                    selectLocation={selectLocation}
                />
                < Maps selectPosition={selectPosition} />
                <div style={{ marginTop: '10px' }}>
                    <strong>Selected Location:</strong> {selectLocation || 'No location selected yet'}
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                        loading={loading}
                    >
                        {id === undefined ? "Create" : "Update"}
                    </Button>
                </Form.Item>
            </Form>




        </div>





    )
}
export default HistoricalPlaceForm;


