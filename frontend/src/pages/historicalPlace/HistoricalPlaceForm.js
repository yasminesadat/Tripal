import React from 'react';
import {useState} from 'react';
import {CreateNewHistoricalPlace} from '../../api/HistoricalPlaceService';
import {CreateNewHistoricalPlace} from '../../api/HistoricalPlaceService';
import { toast } from 'react-toastify';
import { Form, Input,Select, Button, message, Upload, InputNumber,TimePicker } from "antd";
import Maps from '../../components/HistPlaceMap/Maps';
import SearchBox from '../../components/HistPlaceMap/SearchBox';
import moment from 'moment';
import { tourismGovernerID } from '../../IDs';
import { InboxOutlined } from '@ant-design/icons';


function HistoricalPlaceForm(){
    const [selectPosition, setSelectPosition] = useState(null);
    const [selectLocation, setSelectLocation] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        weekdayOpening: "",
        weekdayClosing: "",
        weekendOpening: "",
        weekendClosing: "",
        foreignerPrice: 0,
        nativePrice: 0,
        studentPrice: 0,
      });
    const [images,setImages]=useState(new Set());
    const [encodedImages,setEncodedImages]=useState([]);
    const [tags,setTags]=useState([]);   
    const [periodTags,setPeriodTags]=useState([]); 
     const [loading,setLoading]=useState(false);
     const [tagsOptions,setTagsOption]=useState([]);
     const [periodTagsOptions,setPeriodTagsOption]=useState([]);
     
    useEffect(() => {
    const getHistoricalTags = async () => {
      setLoading(true);
      const productsData = await fet();
      if (productsData) {
        setProducts(productsData);
        setFilteredProducts(productsData);
      }
      setLoading(false);
    };
    const getHistoricalPeriods = async () => {
        setLoading(true);
        const productsData = await fetchProducts();
        if (productsData) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        }
        setLoading(false);
      };

    getProducts();
  }, []);

  

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
    const handleChoosingImage = (e) =>{
        const files = e.fileList.map((file)=>file.originFileObj);
        files.forEach(file =>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () =>{
                setImages((oldImages) => new Set(oldImages).add(reader.result));
                console.log(images);
            }
        })
        console.log(images);
    }
    function handleSubmition(){
       const newHistoricalPlace={
            tourismGovernor:tourismGovernerID
                ,
            name:formData.name
              
            ,
            description:formData.description,
                images: [...images],
            location:{
                address:selectLocation.toString(),
                coordinates:{
                latitude:Number(selectPosition?.lat),
                longitude:Number( selectPosition?.lon),
                }
            },
            openingHours:{
                weekdays: { 
                    openingTime:formData.weekdayOpening.toString(),
                    closingTime:formData.weekdayClosing.toString(),
            
                    },
                weekends:{
                    openingTime:formData.weekendOpening.toString(),
                    closingTime:formData.weekendClosing.toString(),
                    },
            },
            ticketPrices:{
                    foreigner:formData.foreignerPrice,
                    native:formData.nativePrice,
                    student:formData.studentPrice
            },
            tags:[],
            historicalPeriod:[],
            };
        setLoading(true);
        console.log(newHistoricalPlace);
        CreateNewHistoricalPlace(newHistoricalPlace).then((result)=>{
            if(result){
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
        }).catch((err)=>{
            toast.error(err);
            setLoading(false);
        })
    }
    const handleInputChange = (e) => {
        console.log(e.target.value);
          const { name, value } = e.target;
          setFormData({ ...formData, [name]: value });
      };
    const handleTime=(field,time)=>{
        setFormData({ ...formData,[field]:time.format("HH:mm")});
        console.log(formData);
    }
    const handlePrices=(field,price)=>{
        setFormData({ ...formData,[field]:price });
        console.log(formData);
    }
    return (
       <div> 
        <h2 >Create new historical place</h2>
         <Form layout="vertical" onFinish={handleSubmition}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name of the place" }]}
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
          rules={[{ required: true, message: "Please enter the description of the historical place" }]}
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
  rules={[{ required: true, message: "Please enter the weekend opening time" }]}
>
  <TimePicker
    format="HH:mm"
    value={formData.weekendOpening ? moment(formData.weekendOpening, "HH:mm") : null}
    onChange={(time) => handleTime('weekendOpening' ,time)}
    placeholder="Select weekend opening time"
    style={{ width: '100%' }}
  />
</Form.Item>
<Form.Item
  label="Weekend Closing Time"
  name="weekendClosing"
  rules={[{ required: true, message: "Please enter the weekend closing time" }]}
>
  <TimePicker
    format="HH:mm"
    value={formData.weekendClosing ? moment(formData.weekendClosing, "HH:mm") : null}
    onChange={(time) => handleTime('weekendClosing' ,time)}
    placeholder="Select weekend Closing time"
    style={{ width: '100%' }}
  />
</Form.Item>
<Form.Item
  label="Weekdays Opening Time"
  name= "weekdayOpening"
  rules={[{ required: true, message: "Please enter the weekdays opening time" }]}
>
  <TimePicker
    format="HH:mm"
    value={formData.weekdayOpening ? moment(formData.weekdayOpening, "HH:mm") : null}
    onChange={(time) => handleTime('weekdayOpening' ,time)}
    placeholder="Select weekdays opening time"
    style={{ width: '100%' }}
  />
</Form.Item>
<Form.Item
  label="Weekdays Closing Time"
  name="weekdayClosing"
  rules={[{ required: true, message: "Please enter the weekdays closing time" }]}
>
  <TimePicker
    format="HH:mm"
    value={formData.weekdayClosing ? moment(formData.weekdayClosing, "HH:mm") : null}
    onChange={(time) => handleTime('weekdayClosing' ,time)}
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
          options={tagsOptions}
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
          onChange={(selectedPeriodTags) => setPeriodTags(selectedPeriodTags)}
          options= {periodTagsOptions}
        />
      </Form.Item>
      <Form.Item
  label="Foreigner Price"
  name="foreignerPrice"
  rules={[{ required: true, message: "Please enter the foreigner ticket price" }]}
>
  <InputNumber
    min={0}
    value={formData.foreignerPrice}
    onChange={(value)=>{handlePrices('foreignerPrice',value)}}
    placeholder="Enter foreigner ticket price"
    style={{ width: '100%' }}
  />
</Form.Item>


<Form.Item
  label="Native Price"
  name="nativePrice"
  rules={[{ required: true, message: "Please enter the native ticket price" }]}
>
  <InputNumber
    min={0}
    value={formData.nativePrice}
    onChange={(value)=>{handlePrices('nativePrice',value)}}
    placeholder="Enter native ticket price"
    style={{ width: '100%' }}
  />
</Form.Item>


<Form.Item
  label="Student Price"
  name="studentPrice"
  rules={[{ required: true, message: "Please enter the student ticket price" }]}
>
  <InputNumber
    min={0}
    value={formData.studentPrice}
    onChange={(value)=>{handlePrices('studentPrice',value)}}
    placeholder="Enter student ticket price"
    style={{ width: '100%' }}
  />
</Form.Item>
<Form.Item
                    label="Upload Images for the Place"
                    name="images"
                    rules={[{ required: true, message: "Please upload at least one image" }]}
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
        <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                        loading={loading}
                    >
                        Create
                    </Button>
                </Form.Item>
        </Form>
        <div
  style={{
    position: "relative", 
    width: "100vw",
    height: "100vh",
  }}
>

  <div style={{ width: "50%", height: "50%",
   
   }}>
    <Maps selectPosition={selectPosition} />
  </div>


  <div
    style={{
      position: "absolute",  
      top: "0%",            
      zIndex: 999,  
      left:"10%"   ,      // Ensure it appears above the map
      width: "30%",        // Make it smaller (adjust as needed
      padding: "2px", 
      background:"white",      // Add some padding for styling
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow for better visibility
      borderRadius: "4px"    // Rounded corners
    }}
  >
    <SearchBox
      selectPosition={selectPosition}
      setSelectPosition={setSelectPosition}
      setSelectLocation={setSelectLocation}
      selectLocation={selectLocation}
    />
  </div>
</div>




    </div>
                
    
    
            

    )
}
export default HistoricalPlaceForm;


