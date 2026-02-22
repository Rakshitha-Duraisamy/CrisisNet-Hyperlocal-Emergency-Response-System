import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserStatusIndicator = ({ currentUser = null, onStatusChange = null }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('unavailable');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (currentUser?.available) {
      setStatus('available');
    } else {
      setStatus('unavailable');
    }
  }, [currentUser]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    return status === 'available' ? 'Available' : 'Unavailable';
  };

  const getStatusClass = () => {
    if (!isOnline) return 'offline';
    return status;
  };

  const handleClick = () => {
    navigate('/registration-page');
  };

  const handleToggleStatus = (e) => {
    e?.stopPropagation();
    
    const newStatus = status === 'available' ? 'unavailable' : 'available';
    setStatus(newStatus);
    
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <div 
      className="user-status-indicator"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`User status: ${getStatusText()}. Click to manage profile.`}
      onKeyDown={(e) => {
        if (e?.key === 'Enter' || e?.key === ' ') {
          e?.preventDefault();
          handleClick();
        }
      }}
    >
      <button
        onClick={handleToggleStatus}
        className={`user-status-indicator-dot ${getStatusClass()}`}
        aria-label={`Toggle availability status. Current status: ${getStatusText()}`}
        title="Click to toggle availability"
      />
      <span className="user-status-indicator-text">
        {getStatusText()}
      </span>
    </div>
  );
};

export default UserStatusIndicator;