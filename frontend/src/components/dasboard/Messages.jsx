import Sidebar from "./Sidebar";
import PropTypes from 'prop-types';
import { useState } from "react";
import { UserOutlined } from '@ant-design/icons';
import { Avatar, message } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { replyToComplaint } from "@/api/ComplaintsService";

export default function Messages({ complaint, user, role }) {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const replies = complaint?.replies;

  const handleReplyChange = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleReplySubmit = async (event) => {
    event.preventDefault();
    if (!replyMessage) {
      message.warning("Please write a reply!");
      return;
    }

    try {
      await replyToComplaint(complaint._id, {
        message: replyMessage,
        senderId: user,
      });

      const today = new Date();
      const formattedDate = today.getFullYear() + '-' +
        (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
        today.getDate().toString().padStart(2, '0') + ' ' +
        today.getHours().toString().padStart(2, '0') + ':' +
        today.getMinutes().toString().padStart(2, '0') + ':' +
        today.getSeconds().toString().padStart(2, '0');

      complaint.replies.push({
        message: replyMessage,
        senderId: user,
        date: formattedDate
      });

      setReplyMessage("");
      message.success("Reply sent successfully!");
    } catch (error) {
      console.error("Error replying to complaint:", error);
      message.error("Failed to send reply. Please try again.");
    }
  };

  return (
    <>
      <div className={`dashboard ${sideBarOpen ? "-is-sidebar-visible" : ""} js-dashboard`}>
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className="dashboard-main">
          <div className="dashboard-content">
            <h1 className="page-title">Complaint Details</h1>
            <p className="complaint-subtitle">{complaint?.title}</p>

            <div className="dashboard-grid">
              {/* Complaint Info Card */}
              <div className="complaint-info">
                <div className="complaint-card">
                  <h2 className="complaint-title">{complaint?.title}</h2>
                  <p className="complaint-body">{complaint?.body}</p>

                  <div className="status-container">
                    <div className={`status-badge ${complaint?.status === 'resolved' ? 'resolved' : 'pending'}`}>
                      {complaint?.status === 'resolved' ? (
                        <CheckCircleOutlined className="status-icon" />
                      ) : (
                        <ExclamationCircleOutlined className="status-icon" />
                      )}
                      <span>{complaint?.status === 'resolved' ? 'Resolved' : 'Pending'}</span>
                    </div>
                  </div>

                  <div className="complaint-date">
                    {new Date(complaint?.date).toLocaleDateString()}
                  </div>

                  {role === "Admin" && (
                    <div className="issuer-info">
                      <p>Issuer ID: {complaint?.issuerId}</p>
                      <p>Issuer: {complaint?.issuerUserName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Section */}
              <div className="chat-section">
                <div className="chat-container">
                  {/* Chat Header */}
                  <div className="chat-header">
                    <div className="user-info">
                      <Avatar size={48} className="user-avatar">
                        {role === "Admin" ? "T" : "A"}
                      </Avatar>
                      <div className="user-details">
                        <h3>Chat with {role === "Admin" ? "Tourist" : "Admin"}</h3>
                        <p className="status-active">Active</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Section */}
                  <div className="messages-container">
                    {replies?.length === 0 ? (
                      <div className="empty-chat">
                        <Avatar size={64} icon={<UserOutlined />} className="system-avatar" />
                        <p>Start the chat by sending a message.</p>
                      </div>
                    ) : (
                      <div className="messages-list">
                        {replies?.map((reply, index) => (
                          <div key={index} className={`message-wrapper ${reply.senderId === user ? 'sent' : 'received'}`}>
                            <div className="message-content">
                              <div className="message-header">
                                <Avatar
                                  className={`message-avatar ${reply.senderId === user ? 'sent' : 'received'}`}
                                  icon={<UserOutlined />}
                                />
                                <span className="sender-name">
                                  {reply.senderId === user ? 'You' : role === "Admin" ? "Tourist" : "Admin"}
                                </span>
                              </div>

                              <div className={`message-bubble ${reply.senderId === user ? 'sent' : 'received'}`}>
                                {reply.message}
                              </div>

                              <div className="message-timestamp">
                                {new Date(reply.date).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input Section */}
                  <div className="input-container">
                    <input
                      type="text"
                      className="message-input"
                      placeholder="Type your message..."
                      value={replyMessage}
                      onChange={handleReplyChange}
                    />
                    <button
                      onClick={handleReplySubmit}
                      className="send-button"
                    >
                      Send
                      <i className="icon-arrow-top-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background-color: #f5f5f5;
          display: flex;
        }

        .dashboard-main {
          flex: 1;
          padding: 2rem;
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .complaint-subtitle {
          font-size: 1.5rem;
          color: #4a4a4a;
          margin-bottom: 2rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }

        .complaint-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .complaint-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .complaint-body {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #4a4a4a;
          margin-bottom: 2rem;
        }

        .status-container {
          margin-bottom: 1.5rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          font-weight: 600;
        }

        .status-badge.resolved {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-badge.pending {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .complaint-date {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .issuer-info {
          font-size: 1.1rem;
          color: #666;
          margin-top: 1.5rem;
        }

        .chat-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e5e5;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-details h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
        }

        .status-active {
          color: #22c55e;
          font-size: 1rem;
        }

        .messages-container {
          height: 500px;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
          font-size: 1.2rem;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }

        .message-wrapper.sent {
          align-self: flex-end;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .message-avatar.sent {
          background-color: #8f5774;
        }

        .message-avatar.received {
          background-color: #e0829d;
        }

        .sender-name {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .message-bubble {
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          font-size: 1.1rem;
          line-height: 1.5;
        }

        .message-bubble.sent {
          background-color: var(--color-light-6);
          color: #333;
        }

        .message-bubble.received {
          background-color: var(--color-light-purple);
          color: #333;
        }

        .message-timestamp {
          font-size: 0.9rem;
          color: #666;
        }

        .input-container {
          padding: 1.5rem;
          border-top: 1px solid #e5e5e5;
          display: flex;
          gap: 1rem;
        }

        .message-input {
          flex: 1;
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          outline: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .message-input:focus {
          border-color: #8f5774;
          box-shadow: 0 0 5px rgba(143, 87, 116, 0.5);
        }

        .send-button {
          padding: 0.75rem 1.5rem;
          background-color: #8f5774;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .send-button:hover {
          background-color: #7a4363;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .chat-section {
            margin-top: 2rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-main {
            padding: 1rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .message-wrapper {
            max-width: 85%;
          }
        }
      `}</style>
    </>
  );
}

Messages.propTypes = {
  complaint: PropTypes.shape({
    replies: PropTypes.array,
  }),
  user: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

Messages.defaultProps = {
  complaint: {},
  user: {},
  role: 'Tourist',
};