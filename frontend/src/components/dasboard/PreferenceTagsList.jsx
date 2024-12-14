import React, { useState, useEffect } from "react";
import { Tag, Input, Button, Modal, List, message } from "antd";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} from "../../api/PreferenceTagService";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Spinner from "../common/Spinner";
const TagManagerList = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [updateTagId, setUpdateTagId] = useState("");
  const [updateTagName, setUpdateTagName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await getTags();
      setTags(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching tags");
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    try {
      await createTag({ name: newTag });
      message.success("Tag created successfully!");
      setNewTag("");
      fetchTags();
    } catch (error) {
      message.error("Error creating tag");
    }
  };

  // Handle update
  const showUpdateModal = (id, currentName) => {
    setUpdateTagId(id);
    setUpdateTagName(currentName);
    setIsModalVisible(true);
  };

  const handleUpdateTag = async () => {
    try {
      await updateTag(updateTagId, { name: updateTagName });
      message.success("Tag updated successfully!");
      setIsModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error("Error updating tag");
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await deleteTag(id);
      message.success("Tag deleted successfully!");
      setTags((prevTags) => prevTags.filter((tag) => tag._id !== id));
    } catch (error) {
      message.error("Error deleting tag");
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
            <h1 style={styles.headerTitle}>Preference Tags</h1>
          </div>

          <div style={styles.section}>
            <h2 style={styles.title}>Create New Tag</h2>
            <div style={styles.inputGroup}>
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter new tag name"
                style={styles.input}
              />
              <Button
                onClick={handleCreateTag}
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
              dataSource={tags}
              renderItem={(tag) => (
                <List.Item
                  style={styles.listItem}
                  actions={[
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      style={styles.editButton}
                      onClick={() => showUpdateModal(tag._id, tag.name)}
                    >
                      Edit
                    </Button>,
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      style={styles.deleteButton}
                      onClick={() => handleDeleteTag(tag._id)}
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
          visible={isModalVisible}
          onOk={handleUpdateTag}
          okButtonProps={{ style: styles.button }}
          onCancel={() => setIsModalVisible(false)}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <Input
            value={updateTagName}
            onChange={(e) => setUpdateTagName(e.target.value)}
            placeholder="Enter new tag name"

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

export default TagManagerList;