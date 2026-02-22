import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyMap = ({ alerts = [], userLocation = null, onMarkerClick = null }) => {
  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 37.7749, lng: -122.4194 });
  const [zoom, setZoom] = useState(14);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const getMarkerColor = (status) => {
    switch (status) {
      case 'active':
        return '#E74C3C';
      case 'in-progress':
        return '#3498DB';
      case 'resolved':
        return '#27AE60';
      default:
        return '#E74C3C';
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 10));
  };

  const handleRecenter = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(14);
    }
  };

  return (
    <div className="relative w-full h-full bg-muted rounded-xl overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        title="Emergency Map View"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoom}&output=embed`}
        className="absolute inset-0"
      />
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-3">
        <div className="bg-card px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Icon name="MapPin" size={18} color="var(--color-primary)" />
          <span className="text-sm font-medium">
            {alerts?.filter(a => a?.status === 'active')?.length} Active Emergencies
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="bg-card p-2 rounded-lg shadow-lg hover:bg-muted transition-all"
            aria-label="Zoom in"
          >
            <Icon name="Plus" size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-card p-2 rounded-lg shadow-lg hover:bg-muted transition-all"
            aria-label="Zoom out"
          >
            <Icon name="Minus" size={20} />
          </button>
          <button
            onClick={handleRecenter}
            className="bg-card p-2 rounded-lg shadow-lg hover:bg-muted transition-all"
            aria-label="Recenter map"
          >
            <Icon name="Crosshair" size={20} />
          </button>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-10 bg-card px-4 py-3 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E74C3C' }} />
            <span className="text-xs font-medium">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3498DB' }} />
            <span className="text-xs font-medium">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27AE60' }} />
            <span className="text-xs font-medium">Resolved</span>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        {alerts?.slice(0, 5)?.map((alert, index) => (
          <div
            key={alert?.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${(index - 2) * 60}px`,
              top: `${Math.sin(index) * 40}px`
            }}
            onClick={() => onMarkerClick && onMarkerClick(alert)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse"
              style={{ backgroundColor: getMarkerColor(alert?.status) }}
            >
              <Icon name="AlertCircle" size={16} color="#FFFFFF" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyMap;