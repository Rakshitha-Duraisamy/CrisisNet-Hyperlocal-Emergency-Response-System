import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const EmergencyActionButton = ({ emergencyActive = false, onEmergencyClick = null }) => {
  const navigate = useNavigate();
  const [isPulsing, setIsPulsing] = useState(emergencyActive);

  const handleEmergencyClick = () => {
    if (onEmergencyClick) {
      onEmergencyClick();
    }
    
    setIsPulsing(true);
    
    setTimeout(() => {
      navigate('/raise-sos-page');
    }, 150);
  };

  return (
    <button
      onClick={handleEmergencyClick}
      className={`emergency-action-button ${isPulsing ? 'pulsing' : ''}`}
      aria-label="Raise emergency SOS alert"
      title="Raise Emergency SOS"
    >
      <div className="emergency-action-button-content">
        <Icon name="AlertCircle" size={32} color="#FFFFFF" strokeWidth={2.5} />
      </div>
    </button>
  );
};

export default EmergencyActionButton;