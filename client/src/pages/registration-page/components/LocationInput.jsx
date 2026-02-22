import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LocationInput = ({ location, onLocationChange, errors }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleAutoCapture = () => {
    setIsCapturing(true);
    
    setTimeout(() => {
      const mockLocation = {
        address: "123 Main Street, Downtown District, Metro City, 10001",
        latitude: "40.7128",
        longitude: "-74.0060"
      };
      
      onLocationChange(mockLocation);
      setIsCapturing(false);
    }, 1500);
  };

  const handleAddressChange = (e) => {
    onLocationChange({
      ...location,
      address: e?.target?.value
    });
  };

  const handleCoordinateChange = (field, value) => {
    onLocationChange({
      ...location,
      [field]: value
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1">
          <Input
            label="Primary Address"
            type="text"
            placeholder="Enter your street address"
            value={location?.address || ''}
            onChange={handleAddressChange}
            error={errors?.address}
            required
            description="Your location for emergency response coordination"
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleAutoCapture}
            loading={isCapturing}
            iconName="MapPin"
            iconPosition="left"
            className="w-full md:w-auto"
          >
            Auto-Capture
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <Input
          label="Latitude"
          type="text"
          placeholder="40.7128"
          value={location?.latitude || ''}
          onChange={(e) => handleCoordinateChange('latitude', e?.target?.value)}
          error={errors?.latitude}
          description="Decimal degrees format"
        />
        <Input
          label="Longitude"
          type="text"
          placeholder="-74.0060"
          value={location?.longitude || ''}
          onChange={(e) => handleCoordinateChange('longitude', e?.target?.value)}
          error={errors?.longitude}
          description="Decimal degrees format"
        />
      </div>
      {location?.address && location?.latitude && location?.longitude && (
        <div className="p-3 md:p-4 bg-success/10 border border-success/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-success mt-0.5">
              <Icon name="MapPinned" size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-success text-sm md:text-base mb-1">
                Location Verified
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Your emergency response radius: 2km from this location
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-3 md:p-4 bg-muted rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <p className="text-xs md:text-sm text-muted-foreground">
            Your location is used to match you with nearby emergencies. We only share your approximate location (within 100m) with active emergency requesters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationInput;