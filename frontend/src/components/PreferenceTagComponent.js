import React, { useState, useEffect } from 'react';
import { Tag, Input, Button, Modal, List, Space, message } from 'antd';
import { createTag, getTags, updateTag, deleteTag } from '../api/PreferenceTagSevice';

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [updateTagId, setUpdateTagId] = useState('');
  const [updateTagName, setUpdateTagName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  // GET all tags
  const fetchTags = async () => {
    try {
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      message.error('Error fetching tags');
    }
  };

  // POST a new tag
  const handleCreateTag = async () => {
    try {
      await createTag({ Name: newTag });
      message.success('Tag created successfully!');
      setNewTag('');
      fetchTags(); //refersh tag list after creating
    } catch (error) {
      message.error('Error creating tag');
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
      await updateTag(updateTagId, { Name: updateTagName });
      message.success('Tag updated successfully!');
      setIsModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error('Error updating tag');
    }
  };

  // handle delete
  const handleDeleteTag = async (id) => {
    try {
      await deleteTag(id);
      message.success('Tag deleted successfully!');
      fetchTags();
    } catch (error) {
      message.error('Error deleting tag');
    }
  };

  return (
    <div>
      <h2>Manage Preference Tags</h2>

      <div>
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter new tag"
        />
        <Button type="primary" onClick={handleCreateTag}>Create Tag</Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={tags}
        renderItem={(tag) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => showUpdateModal(tag._id, tag.Name)}>Edit</Button>,
              <Button type="link" danger onClick={() => handleDeleteTag(tag._id)}>Delete</Button>
            ]}
          >
            <Tag>{tag.Name}</Tag>
          </List.Item>
        )}
      />

      <Modal
        title="Update Tag"
        open={isModalVisible}
        onOk={handleUpdateTag}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={updateTagName}
          onChange={(e) => setUpdateTagName(e.target.value)}
          placeholder="Enter new tag name"
        />
      </Modal>
    </div>
  );
};

export default TagManager;
