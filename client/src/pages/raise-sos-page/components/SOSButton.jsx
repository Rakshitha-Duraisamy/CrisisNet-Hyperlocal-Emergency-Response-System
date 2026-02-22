import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SOSButton = ({ onClick, disabled }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onClick();
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full
          transition-all duration-300 ease-out
          ${disabled 
            ? 'bg-muted cursor-not-allowed opacity-50' :'bg-error hover:bg-error/90 cursor-pointer'
          }
          ${isPressed ? 'scale-95' : 'scale-100 hover:scale-105'}
          shadow-2xl hover:shadow-error/50
          focus:outline-none focus:ring-4 focus:ring-error/30
        `}
        aria-label="Raise emergency SOS alert"
        style={{
          boxShadow: disabled 
            ? 'none' :'0 20px 60px rgba(231, 76, 60, 0.4), 0 0 0 0 rgba(231, 76, 60, 0.7)',
          animation: disabled ? 'none' : 'sos-pulse 2s ease-out infinite'
        }}
      >
        <div className="absolute inset-0 rounded-full bg-error/20 animate-ping" style={{ animationDuration: '2s' }} />
        
        <div className="relative flex flex-col items-center justify-center h-full">
          <Icon name="AlertCircle" size={64} color="#FFFFFF" strokeWidth={2.5} />
          <span className="mt-4 text-3xl md:text-4xl font-bold text-white tracking-wider">
            SOS
          </span>
          <span className="mt-2 text-sm md:text-base text-white/90 font-medium">
            Emergency Alert
          </span>
        </div>
      </button>
      
      <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-muted-foreground max-w-md px-4">
        Press the SOS button to send an immediate emergency alert to nearby helpers within 2km radius
      </p>
      
      <style jsx>{`
        @keyframes sos-pulse {
          0%, 100% {
            box-shadow: 0 20px 60px rgba(231, 76, 60, 0.4), 0 0 0 0 rgba(231, 76, 60, 0.7);
          }
          50% {
            box-shadow: 0 20px 60px rgba(231, 76, 60, 0.4), 0 0 0 20px rgba(231, 76, 60, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default SOSButton;