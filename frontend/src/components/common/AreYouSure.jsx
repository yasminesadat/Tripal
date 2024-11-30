import { useState } from 'react';
import { Modal, Button } from 'antd';

const AreYouSure = ({ visible, onConfirm, onCancel, message, confirmButtonText }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    await onConfirm();
    setConfirmLoading(false);
  };

  return (
    <Modal
      title="Are you sure?"
      open={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okText={confirmButtonText || "Yes"}
      cancelText="No"
      bodyStyle={{ padding: '20px' }}
      footer={[
        <Button
          key="back"
          style={{
            borderColor: '#8f5774',
            color: '#036264',
            transition: 'all 0.3s ease',
          }}
          onClick={onCancel}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#036264';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#036264';
          }}
        >
          No
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleOk}
          style={{ backgroundColor: '#036264', borderColor: '#036264' }}
        >
          {confirmButtonText || "Yes"}
        </Button>,
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default AreYouSure;
