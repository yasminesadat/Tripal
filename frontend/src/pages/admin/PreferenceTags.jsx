import React, { useState, useEffect } from "react";
import { List, Button, Modal, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import {
    createTag,
    getTags,
    updateTag,
    deleteTag,
} from "../../api/PreferenceTagService";
import Sidebar from "@/components/dasboard/Sidebar";
import Header from "@/components/dasboard/Header";

const TagManager = () => {
    const [nameValue, setNameValue] = useState("");
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateTagName, setUpdateTagName] = useState("");
    const [updateTagID, setUpdateTagID] = useState("");
    const [sideBarOpen, setSideBarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTags();
                setData(response.data);
            } catch (error) {
                console.error("Error fetching tags:", error);
                message.error("Failed to fetch tags!");
            }
        };
        fetchData();
    }, []);

    const notifyDelete = (name) =>
        message.success(`Tag ${name} is deleted successfully!`);
    const notifyCreate = (name) =>
        message.success(`Tag ${name} is added successfully!`);
    const notifyUpdate = (name) =>
        message.success(`Tag ${name} is updated successfully!`);

    const handleInputChange = (event) => {
        setNameValue(event.target.value);
    };

    const handleButtonClick = async () => {
        try {
            const createdTag = await createTag({ name: nameValue });
            const newObject = {
                name: nameValue,
                _id: createdTag.data._id
            };
            setData([...data, newObject]);
            setNameValue("");
            notifyCreate(nameValue);
        } catch (error) {
            message.error("Failed to create tag!");
        }
    };

    const deletePreferenceTag = async (id, name) => {
        try {
            await deleteTag(id);
            const updatedData = data.filter((item) => item._id !== id);
            setData(updatedData);
            notifyDelete(name);
        } catch (error) {
            message.error("Failed to delete tag!");
        }
    };

    const editPreferenceTag = async (id, name) => {
        setUpdateTagID(id);
        setUpdateTagName(name);
        setIsModalVisible(true);
    };

    const handleUpdate = async (id, name) => {
        try {
            await updateTag(id, { name: name });
            let oldName;
            const newData = data.map((c) => {
                if (c._id === id) {
                    oldName = c.name;
                    const newObj = {
                        name: updateTagName,
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
            message.error("Failed to update tag!");
        }
    };

    // Styles and global styles can be added similarly to the ActivityCategoryDetails component
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

    return (
        <>
            <div
                className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}
            >
                <Sidebar setSideBarOpen={setSideBarOpen} />

                <div className="dashboard__content">
                    <Header setSideBarOpen={setSideBarOpen} />
                    <div style={styles.container}>
                        <style>{globalStyles}</style>
                        <div style={styles.card}>
                            <div style={styles.header}>
                                <h1 style={styles.headerTitle}>Preference Tags</h1>
                            </div>

                            <div style={styles.section}>
                                <h2 style={styles.title}>Create New Tag</h2>
                                <div style={styles.inputGroup}>
                                    <Input
                                        value={nameValue}
                                        onChange={handleInputChange}
                                        placeholder="Enter new tag name"
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

                                <h2 style={styles.title}>Existing Tags</h2>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={(tag) => (
                                        <List.Item
                                            style={styles.listItem}
                                            actions={[
                                                <Button
                                                    type="text"
                                                    icon={<EditOutlined />}
                                                    style={styles.editButton}
                                                    onClick={() => editPreferenceTag(
                                                        tag._id,
                                                        tag.name
                                                    )}
                                                >
                                                    Edit
                                                </Button>,
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    style={styles.deleteButton}
                                                    onClick={() => deletePreferenceTag(
                                                        tag._id,
                                                        tag.name
                                                    )}
                                                >
                                                    Delete
                                                </Button>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={
                                                    <span style={styles.categoryName}>
                                                        {tag.name}
                                                    </span>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>

                        <Modal
                            title={<span style={styles.modal.title}>Update Tag</span>}
                            open={isModalVisible}
                            onOk={() => handleUpdate(updateTagID, updateTagName)}
                            okButtonProps={{ style: styles.button }}
                            onCancel={() => setIsModalVisible(false)}
                            cancelButtonProps={{ style: { display: 'none' } }}
                        >
                            <Input
                                value={updateTagName}
                                onChange={(e) => setUpdateTagName(e.target.value)}
                                placeholder="Enter new tag name"
                                style={styles.modal.input}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TagManager;