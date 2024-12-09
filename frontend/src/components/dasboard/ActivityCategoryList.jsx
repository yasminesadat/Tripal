import { useState, useEffect } from "react";
import { List, Button, Modal, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import ActivityCategoryApi from "../../api/ActivityCategoryService";
import Spinner from "../common/Spinner";
const ActivityCategoryDetailsList = () => {

    const [nameValue, setNameValue] = useState("");
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateCategoryName, setUpdateCategoryName] = useState("");
    const [updateCategoryID, setUpdateCategoryID] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await ActivityCategoryApi.getActivityCategories();

                setData(response);
                setLoading(false);
                console.log("Fetched categories:", response);
            } catch (error) {
                console.error("Error fetching activity categories:", error);
                message.error("Failed to fetch activity categories!");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const notifyDelete = (name) =>
        message.success(`Activity Category ${name} is deleted successfully!`);
    const notifyCreate = (name) =>
        message.success(`Activity Category ${name} is added successfully!`);
    const notifyUpdate = (name) =>
        message.success(`Activity Category ${name} is updated successfully!`);

    const handleInputChange = (event) => {
        setNameValue(event.target.value);
    };

    const handleButtonClick = async () => {
        try {
            const createdCategory = await ActivityCategoryApi.createActivityCategory(
                nameValue
            );
            const id = createdCategory._id;
            const newObject = {
                Name: nameValue,
                _id: id
            };
            setData([...data, newObject]);
            setNameValue("");
            notifyCreate(nameValue);
        } catch (error) {
            message.error("Failed to create activity category!");
        }
    };

    const deleteActivityCategory = async (id, name) => {
        try {
            await ActivityCategoryApi.deleteActivityCategory(id);
            const updatedData = data.filter((item) => item._id !== id);
            setData(updatedData);
            notifyDelete(name);
        } catch (error) {
            message.error("Failed to delete activity category!");
        }
    };
    const editActivityCategory = async (id, name) => {
        setUpdateCategoryID(id);
        setUpdateCategoryName(name)
        setIsModalVisible(true);
    };
    const handleUpdate = async (id, name) => {
        try {
            await ActivityCategoryApi.updateActivityCategory(id, name);
            let oldName;
            const newData = data.map((c) => {
                if (c._id === id) {
                    oldName = c.Name;
                    const newObj = {
                        Name: updateCategoryName,
                        _id: id
                    };
                    return newObj;
                } else {
                    return c;
                }
            });
            setData(newData);
            notifyUpdate(oldName);
            setIsModalVisible(false);
        } catch (error) {

            message.error("Failed to update activity category!");
        }
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

    .ant-modal-content .ant-btn-primary {
        background-color: #5a9ea0 !important;
        border-color: #5a9ea0 !important;
    }

    .ant-modal-content .ant-btn-primary:hover {
        background-color: #036264 !important;
        border-color: #036264 !important;
    }

    .ant-list-item:hover {
        background-color: #e5f8f8;
    }

    .ant-btn-text:hover {
        background-color: transparent !important;
    }
`;
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
        editButton: {
            color: '#5a9ea0',
            padding: '4px 12px',
        },
        deleteButton: {
            color: '#e0829d',
            padding: '4px 12px',
        },
        listItem: {
            padding: '16px',
            borderBottom: '1px solid #dac4d0',
            transition: 'all 0.2s ease',
        },
        categoryName: {
            color: '#036264',
            fontSize: '15px',
            fontWeight: '500',
        },
        modal: {
            title: {
                color: '#036264',
                fontWeight: '500',
            },
            input: {
                marginTop: '16px',
            },
        },
    };
    if (loading) return <Spinner />

    return (
        <>
            <div style={styles.container}>
                <style>{globalStyles}</style>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.headerTitle}>Activity Categories</h1>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.title}>Create New Category</h2>
                        <div style={styles.inputGroup}>
                            <Input
                                value={nameValue}
                                onChange={handleInputChange}
                                placeholder="Enter new category name"
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

                        <h2 style={styles.title}>Existing Categories</h2>
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={(activityCategory) => (
                                <List.Item
                                    style={styles.listItem}
                                    actions={[
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            style={styles.editButton}
                                            onClick={() => editActivityCategory(
                                                activityCategory._id,
                                                activityCategory.Name
                                            )}
                                        >
                                            Edit
                                        </Button>,
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            style={styles.deleteButton}
                                            onClick={() => deleteActivityCategory(
                                                activityCategory._id,
                                                activityCategory.Name
                                            )}
                                        >
                                            Delete
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={
                                            <span style={styles.categoryName}>
                                                {activityCategory.Name}
                                            </span>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </div>

                <Modal
                    title={<span style={styles.modal.title}>Update Activity Category</span>}
                    open={isModalVisible}
                    onOk={() => handleUpdate(updateCategoryID, updateCategoryName)}
                    onCancel={() => setIsModalVisible(false)}
                    okButtonProps={{ style: styles.button }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <Input
                        value={updateCategoryName}
                        onChange={(e) => setUpdateCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                        style={{
                            height: "50px",
                            border: "1px solid #d9d9d9",
                            outline: "none",
                            width: "100%",
                            backgroundColor: "transparent"
                        }}
                    />
                </Modal>
            </div>

        </>
    );
};

export default ActivityCategoryDetailsList;