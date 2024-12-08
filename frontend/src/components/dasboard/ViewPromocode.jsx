import React, { useState, useEffect } from "react";
import { List, Button, Input } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { createPromoCode, getPromoCodes } from "@/api/AdminService";
import Spinner from "../common/Spinner";
const PromoCodeDetailsComponent = () => {
    const [name, setName] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [data, setData] = useState([]);
    const[loading,setLoading]=useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getPromoCodes();
                setData(response);
                setLoading(false);
                console.log("Fetched promoCodes:", response);
            } catch (error) {
                console.error("Error fetching promo codes:", error);
                message.error("Failed to fetch promo codes!");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const notifyCreate = (code) =>
        message.success(`Promo Code ${code} is added successfully!`);

    const handlePromoCodeChange = (event) => {
        setName(event.target.value);
    };

    const handleDiscountChange = (event) => {
        const value = Math.min(100, Math.max(0, Number(event.target.value)));
        setDiscountPercentage(value);
    };

    const handleButtonClick = async () => {
        if (!name.trim()) {
            message.error("Please enter a promo code");
            return;
        }
        if (discountPercentage <= 0 || discountPercentage > 100) {
            message.error("Discount percentage must be between 1 and 100");
            return;
        }

        try {
            const createdCode = await createPromoCode({ name, discountPercentage });
            const newObject = {
                name: name,
                discountPercentage: discountPercentage,
                _id: createdCode._id
            };
            setData([...data, newObject]);
            setName("");
            setDiscountPercentage(0);
            notifyCreate(name);
        } catch (error) {

            message.error("Failed to create promo code");
        }
    };

    const styles = {

        container: {
            padding: '40px 20px',
            minHeight: '100vh',
        },
        card: {
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        header: {
            backgroundColor: '#dac4d0',
            padding: '24px 32px',
            borderRadius: '8px 8px 0 0',
        },
        headerTitle: {
            color: '#036264',
            margin: 0,
            fontSize: '24px',
            fontWeight: '600',
        },
        section: {
            padding: '24px 32px',
        },
        title: {
            color: '#036264',
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '16px',
        },
        inputGroup: {
            display: 'flex',
            gap: '12px',
            marginBottom: '32px',
        },
        input: {
            flex: 1,
            fontSize: '14px',
            height: "50px",
            border: "1px solid #d9d9d9",
            outline: "none",
            width: "100%",
            backgroundColor: "transparent"
        },
        button: {
            backgroundColor: '#5a9ea0',
            borderColor: '#5a9ea0',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        },
        listItem: {
            padding: '16px',
            borderBottom: '1px solid #dac4d0',
            transition: 'all 0.2s ease',
        },
        promoCode: {
            color: '#036264',
            fontSize: '15px',
            fontWeight: '500',
        },
    };

    const globalStyles = `
    .ant-input:focus, 
    .ant-input-focused,
    .ant-input:hover {
        border-color: #5a9ea0 !important;
        box-shadow: 0 0 0 2px rgba(90, 158, 160, 0.1) !important;
    }

    .ant-btn-primary:hover {
        background-color: #036264 !important;
        border-color: #036264 !important;
    }

    .ant-list-item:hover {
        background-color: #e5f8f8;
    }
    `;
if(loading)return <Spinner/>
    return (
        <>
          
                    <div style={styles.container}>
                        <style>{globalStyles}</style>
                        <div style={styles.card}>
                            <div style={styles.header}>
                                <h1 style={styles.headerTitle}>Promo Codes</h1>
                            </div>

                            <div style={styles.section}>
                                <h2 style={styles.title}>Create New Promo Code</h2>
                                <div style={styles.inputGroup}>



                                    <Input

                                        value={name}
                                        onChange={handlePromoCodeChange}
                                        placeholder="Enter promo code"
                                        style={styles.input}
                                    />
                                    <Input
                                        type="number"
                                        value={discountPercentage}
                                        onChange={handleDiscountChange}
                                        placeholder="Discount percentage"
                                        min={0}
                                        max={100}
                                        style={styles.input}
                                    />
                                    <Button
                                        onClick={handleButtonClick}
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        style={styles.button}
                                    >
                                        Add
                                    </Button>
                                </div>

                                <h2 style={styles.title}>Existing Promo Codes</h2>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={(promoCode) => (
                                        <List.Item style={styles.listItem}>
                                            <List.Item.Meta
                                                title={
                                                    <span style={styles.promoCode}>
                                                        Code: {promoCode.name} - {promoCode.discountPercentage}% discount
                                                    </span>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                   
        </>
    );
};

export default PromoCodeDetailsComponent;