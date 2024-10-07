import {React,useState,useEffect} from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import {createTourGuide,updateProfile,getProfileData} from '../../api/TourGuideService';
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const TourGuideForm = () => {
    const { id } = useParams();
    const isUpdate=id;
    const [form] = Form.useForm(); 
    const[loading,setLoading]=useState(false);
    const [formData,setFormData]=useState({
        userName:'',
        email: '',
        password:'',
        mobileNumber:'',
        experienceYears: 0
});
    useEffect(() => {
        const getTourGuideData = async (id) => {
            
            try{
                setLoading(true);
            const profileData = await getProfileData(id);
            const data= await profileData.data;
            setFormData(data);
            form.setFieldsValue(data);
            console.log(data)
            setLoading(false);
        }catch(e){
            toast.error(e);
            setLoading(false);
        }
        };
      console.log(isUpdate!==null);
     if(isUpdate!==undefined)
        {getTourGuideData(id);}
    }, [isUpdate,id]);
  
  const onFinish = async() => {
   if(isUpdate===undefined){
    try{
        setLoading(true);
        const result =await createTourGuide(formData);
        if (result) {
            setLoading(false);
            toast.success('profile created successfully')
            setFormData({
                userName:'',
        email: '',
        password:'',
        mobileNumber:'',
        experienceYears: 0
            });
            
        }
    }
    catch (err) {
        toast.error(err);
        setLoading(false);
    }
   }
   else{
    try{
        setLoading(true);
        const result =await updateProfile(id, formData);
            setLoading(false);
            toast.success('profile Updated successfully')
            setFormData({
                userName:'',
                email: '',
                password:'',
                mobileNumber:'',
                experienceYears: 0
            });
            
        
    }
    catch (err) {
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
const handleYearsChange = (field, years) => {
    setFormData({ ...formData, [field]: years });
    console.log(formData);
}
  

  return (
    <Form
    form={form}
      name="userForm"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ mobileNumber: '', experienceYears: 0 }}
      onFinish={onFinish}
      autoComplete="off"
    >
       
      <Form.Item
        label="name"
        name="userName"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleInputChange}
        placeholder="Enter Your name"
         />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input 
        type="text"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter Your Email"/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password 
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Enter Your password"/>
      </Form.Item>

      <Form.Item
        label="Mobile Number"
        name="mobileNumber"
        rules={[
          { pattern: /^\d+$/, message: 'Mobile number must be digits only!' }
        ]}
      >
        <Input 
        type="text"
        name="mobileNumber"
        value={formData.mobile}
        onChange={handleInputChange}
        placeholder="Optional" />
      </Form.Item>


      <Form.Item
        label="Experience Years"
        name="experienceYears"
        rules={[{ type: 'number', min: 0, message: 'Experience must be a non-negative number!' }]}
      >
        <InputNumber min={0}
         value={formData.experienceYears}
         onChange={(value) => { handleYearsChange('experienceYears', value) }}
         placeholder="Enter your Experience years"
         style={{ width: '100%' }} />
      </Form.Item>

     
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TourGuideForm;
