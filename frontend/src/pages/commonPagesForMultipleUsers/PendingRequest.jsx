import { useLocation } from "react-router-dom";
import { Card, Timeline } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import FooterThree from "@/components/layout/footers/FooterThree";
import GuestHeader from "@/components/layout/header/GuestHeader";
import MetaComponent from "@/components/common/MetaComponent";
const PendingPage = () => {
    const location = useLocation();
    const metadata = {
        title: 'Request Processing | Tripal',
        description: 'Your application is being reviewed by our team'
    }
    return (
        <>
            <MetaComponent meta={metadata} />

            <div className="page-wrapper">
                <GuestHeader />
                <main className="page-content">
                    <div className="pending-page">
                        <div className="pending-container">
                            <div className="status-card">
                                <div className="loader-section">
                                    <div className="circular-loader"></div>
                                    <div className="status-icon">
                                        <SyncOutlined spin style={{ fontSize: '24px', color: 'var(--color-dark-purple)' }} />
                                    </div>
                                </div>

                                <Card className="info-card">
                                    <h1>Request Processing</h1>
                                    <p className="subtitle">Your application is being reviewed by our team</p>

                                    <div className="user-info">
                                        <div className="info-item">
                                            <label>Username</label>
                                            <p>{location.state.userName}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Email</label>
                                            <p>{location.state.email}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Role</label>
                                            <p>{location.state.role}</p>
                                        </div>
                                    </div>

                                    <Timeline
                                        items={[
                                            {
                                                dot: <CheckCircleOutlined style={{ color: 'var(--color-dark-purple)' }} />,
                                                color: 'var(--color-dark-purple)',
                                                children: 'Application Submitted',
                                            },
                                            {
                                                dot: <SyncOutlined spin style={{ color: 'var(--color-pink)' }} />,
                                                color: 'var(--color-pink)',
                                                children: 'Under Review',
                                            },
                                            {
                                                dot: <ClockCircleOutlined style={{ color: 'var(--color-light-purple)' }} />,
                                                color: 'var(--color-light-purple)',
                                                children: 'Final Approval',
                                            },
                                        ]}
                                    />

                                    <div className="notification-message">
                                        <p>You will receive a notification once your application has been processed.</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
                <FooterThree />
            </div>

            <style jsx>{`
                .pending-page {
                    min-height: 100vh;
                    background: white;
                    padding: 40px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pending-container {
                    max-width: 800px;
                    width: 100%;
                    margin: 0 auto;
                }

                .status-card {
                    position: relative;
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 10px 40px rgba(143, 87, 116, 0.1);
                    animation: slideUp 0.5s ease-out;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .loader-section {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 40px;
                }

                .circular-loader {
                    width: 100%;
                    height: 100%;
                    border: 3px solid var(--color-light-purple);
                    border-top-color: var(--color-dark-purple);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .status-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 15px;
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(143, 87, 116, 0.1);
                }

                @keyframes spin {
                    100% {
                        transform: rotate(360deg);
                    }
                }

                .info-card {
                    text-align: center;
                }

                .info-card h1 {
                    color: var(--color-dark-purple);
                    font-size: 28px;
                    margin-bottom: 8px;
                }

                .subtitle {
                    color: var(--color-pink);
                    font-size: 16px;
                    margin-bottom: 32px;
                }

                .user-info {
                    background: var(--color-footer);
                    padding: 24px;
                    border-radius: 12px;
                    margin-bottom: 32px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }

                .info-item {
                    text-align: left;
                }

                .info-item label {
                    color: var(--color-pink);
                    font-size: 14px;
                    margin-bottom: 4px;
                    display: block;
                }

                .info-item p {
                    color: var(--color-dark-purple);
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0;
                }

                .notification-message {
                    margin-top: 32px;
                    padding: 16px;
                    background: var(--color-footer);
                    border-radius: 8px;
                    color: var(--color-dark-purple);
                }

                @media (max-width: 768px) {
                    .status-card {
                        padding: 20px;
                    }

                    .user-info {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
};

export default PendingPage;