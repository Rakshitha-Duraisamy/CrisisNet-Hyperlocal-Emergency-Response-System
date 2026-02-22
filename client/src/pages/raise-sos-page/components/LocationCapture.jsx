import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationCapture = ({ location, onLocationChange, error }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (!location?.latitude && !location?.longitude) {
      captureLocation();
    }
  }, []);

  const captureLocation = () => {
    setIsCapturing(true);
    setLocationError('');

    if ('geolocation' in navigator) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          onLocationChange({
            latitude: position?.coords?.latitude?.toFixed(6),
            longitude: position?.coords?.longitude?.toFixed(6),
            accuracy: position?.coords?.accuracy?.toFixed(2)
          });
          setIsCapturing(false);
        },
        (error) => {
          setLocationError('Unable to capture location. Please enter manually.');
          setManualMode(true);
          setIsCapturing(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation not supported. Please enter manually.');
      setManualMode(true);
      setIsCapturing(false);
    }
  };

  const handleManualInput = (field, value) => {
    onLocationChange({
      ...location,
      [field]: value
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <label className="text-base md:text-lg font-semibold text-foreground">
          Your Location <span className="text-error">*</span>
        </label>
        
        {!manualMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setManualMode(true)}
            iconName="Edit"
            iconPosition="left"
            iconSize={16}
          >
            Manual Entry
          </Button>
        )}
      </div>
      {!manualMode ? (
        <div className="bg-card border-2 border-border rounded-xl p-4 md:p-5">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="MapPin" size={24} className="text-primary" />
            </div>
            
            <div className="flex-1">
              {isCapturing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm md:text-base text-muted-foreground">
                      Capturing your location...
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Please allow location access when prompted
                  </p>
                </div>
              ) : location?.latitude && location?.longitude ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <Icon name="CheckCircle" size={20} />
                    <span className="text-sm md:text-base font-medium">
                      Location Captured
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Latitude:</span>
                      <span className="font-mono text-foreground">{location?.latitude}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Longitude:</span>
                      <span className="font-mono text-foreground">{location?.longitude}</span>
                    </div>
                    {location?.accuracy && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="font-mono text-foreground">±{location?.accuracy}m</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={captureLocation}
                    iconName="RefreshCw"
                    iconPosition="left"
                    iconSize={14}
                    className="mt-2"
                  >
                    Recapture Location
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm md:text-base text-muted-foreground">
                    No location captured yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={captureLocation}
                    iconName="MapPin"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Capture Location
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {locationError && (
            <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} />
                {locationError}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={location?.latitude || ''}
                onChange={(e) => handleManualInput('latitude', e?.target?.value)}
                placeholder="e.g., 28.6139"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={location?.longitude || ''}
                onChange={(e) => handleManualInput('longitude', e?.target?.value)}
                placeholder="e.g., 77.2090"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setManualMode(false);
              captureLocation();
            }}
            iconName="MapPin"
            iconPosition="left"
            iconSize={16}
          >
            Use Auto Location
          </Button>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-2">
          <Icon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationCapture;