import React from 'react';
import { Modal } from 'antd';
import { CheckCircleFilled, DollarOutlined, WalletOutlined } from '@ant-design/icons';

const RefundToast = ({ amount, resourceType, walletBalance, visible, onClose }) => {
    return (
        <Modal
            title={
                <div style={{ color: '#8f5774', borderBottom: '2px solid #dac4d0' }} className="text-xl pb-2">
                    Refund Details
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            styles={{
                header: {
                    borderBottom: 'none',
                },
                mask: {
                    backgroundColor: 'rgba(17, 48, 42, 0.5)', // dark-green with opacity
                },
                content: {
                    boxShadow: '0 4px 12px rgba(143, 87, 116, 0.15)', // dark-purple with opacity
                }
            }}
        >
            <div className="text-center py-6" style={{ backgroundColor: '#fff' }}>
                <CheckCircleFilled className="text-5xl mb-4" style={{ color: '#8f5774' }} />

                <h3 className="text-xl font-semibold mt-4" style={{ color: '#11302a' }}>
                    Amount Refunded
                </h3>

                <div className="flex items-center justify-center gap-2 my-4">
                    <DollarOutlined className="text-xl" style={{ color: '#036264' }} />
                    <span className="text-2xl font-bold" style={{ color: '#8f5774' }}>
                        EGP {amount ? new Intl.NumberFormat().format(amount.toFixed(2)) : '0.00'}
                    </span>
                </div>

                <div
                    className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg"
                    style={{ backgroundColor: '#e5f8f8' }}
                >
                    <WalletOutlined style={{ color: '#5a9ea0' }} />
                    <span style={{ color: '#036264' }}>New wallet balance: </span>
                    <span className="font-semibold" style={{ color: '#036264' }}>
                        EGP {walletBalance ? new Intl.NumberFormat().format(walletBalance.toFixed(2)) : '0.00'}
                    </span>
                </div>
            </div>
        </Modal>
    );
};

export default RefundToast;