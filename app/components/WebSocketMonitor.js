"use client";

import { useState } from 'react';

const WebSocketMonitor = ({ connected, messages, clearMessages, sendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSendTest = () => {
    sendMessage(messageText);
    setMessageText('');
  };

  if (isMinimized) {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          backgroundColor: connected ? '#4CAF50' : '#dc3545',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          zIndex: 1000
        }}
        onClick={() => setIsMinimized(false)}
      >
        WebSocket {connected ? 'Connected' : 'Disconnected'} ({messages.length})
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      width: '300px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '5px',
      padding: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>WebSocket Monitor</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: connected ? '#28a745' : '#dc3545'
          }}></div>
          <button 
            onClick={() => setIsMinimized(true)} 
            style={{ 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer', 
              padding: '0 5px'
            }}
          >
            −
          </button>
        </div>
      </div>
      
      <div style={{ 
        height: '150px', 
        overflowY: 'auto', 
        backgroundColor: '#ffffff',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        padding: '5px',
        marginBottom: '10px'
      }}>
        {messages.length === 0 ? (
          <p style={{ color: '#6c757d', textAlign: 'center' }}>No messages</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ 
              padding: '5px', 
              borderBottom: '1px solid #f2f2f2',
              fontSize: '12px'
            }}>
              <div><strong>Type:</strong> {msg.type || msg.action}</div>
              <div><strong>Time:</strong> {new Date(msg.serverTimestamp || msg.timestamp).toLocaleTimeString()}</div>
              <div><strong>Content:</strong> {msg.content || JSON.stringify(msg)}</div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <input 
          type="text" 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Message content..."
          style={{ 
            flex: 1, 
            padding: '6px', 
            border: '1px solid #ced4da', 
            borderRadius: '4px',
            marginRight: '5px'
          }}
        />
        <button 
          onClick={handleSendTest}
          disabled={!connected}
          style={{ 
            backgroundColor: connected ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 10px',
            cursor: connected ? 'pointer' : 'not-allowed'
          }}
        >
          Send
        </button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={clearMessages}
          style={{ 
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '12px'
          }}
        >
          Clear
        </button>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          Status: {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
};

export default WebSocketMonitor;