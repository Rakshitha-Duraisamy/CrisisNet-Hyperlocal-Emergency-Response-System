import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PrimaryTabNavigation from '../../components/ui/PrimaryTabNavigation';
import EmergencyActionButton from '../../components/ui/EmergencyActionButton';
import SOSButton from './components/SOSButton';
import EmergencyTypeSelector from './components/EmergencyTypeSelector';
import DescriptionField from './components/DescriptionField';
import LocationCapture from './components/LocationCapture';
import AlertProcessingModal from './components/AlertProcessingModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const RaiseSOSPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emergencyType: '',
    description: '',
    location: {
      latitude: '',
      longitude: '',
      accuracy: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const mockCurrentUser = {
    id: 'user_001',
    name: 'John Doe',
    available: true
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.emergencyType) {
      newErrors.emergencyType = 'Please select an emergency type';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Please describe your emergency situation';
    } else if (formData?.description?.trim()?.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData?.location?.latitude || !formData?.location?.longitude) {
      newErrors.location = 'Location is required for emergency response';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSOSClick = async () => {
    if (!validateForm()) {
      const firstErrorElement = document.querySelector('[aria-invalid="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setIsProcessing(true);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
           type: formData.emergencyType,
          description: formData.description,
  location: {
    type: "Point",
    coordinates: [
      parseFloat(formData.location.longitude),
      parseFloat(formData.location.latitude)
    ]
  }
})
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessMessage(true);

        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);

      } else {
        alert(data.message);
        setIsProcessing(false);
      }

    } catch (error) {
      console.error("Error sending SOS:", error);
      setIsProcessing(false);
    }
  };

  const handleProcessingComplete = (success) => {
    setIsProcessing(false);
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };

  const handleEmergencyTypeChange = (type) => {
    setFormData(prev => ({ ...prev, emergencyType: type }));
    if (errors?.emergencyType) {
      setErrors(prev => ({ ...prev, emergencyType: '' }));
    }
  };

  const handleDescriptionChange = (description) => {
    setFormData(prev => ({ ...prev, description }));
    if (errors?.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({ ...prev, location }));
    if (errors?.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const isFormValid = formData?.emergencyType && 
                      formData?.description?.trim()?.length >= 20 && 
                      formData?.location?.latitude && 
                      formData?.location?.longitude;

  return (
    <>
      <Helmet>
        <title>Raise Emergency SOS - CrisisNet</title>
        <meta name="description" content="Quickly generate emergency alerts and connect with nearby helpers during crisis situations" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <PrimaryTabNavigation currentUser={mockCurrentUser} />

        <main className="max-w-4xl mx-auto px-4 py-6 md:py-8 lg:py-12 pb-32 md:pb-24">
          {showSuccessMessage && (
            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-success/10 border-2 border-success rounded-xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-success mb-2">
                    Emergency Alert Sent Successfully!
                  </h3>
                  <p className="text-sm md:text-base text-foreground mb-3">
                    Your SOS alert has been broadcast to nearby helpers. Response teams are being notified.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} />
                    <span>Redirecting to dashboard in 3 seconds...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-error/10 rounded-full mb-4">
              <Icon name="AlertTriangle" size={20} className="text-error" />
              <span className="text-sm md:text-base font-semibold text-error">
                Emergency Response System
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
              Raise Emergency SOS
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Send an immediate alert to nearby helpers within 2km radius. Help will be dispatched based on emergency type and priority.
            </p>
          </div>

          <div className="mb-8 md:mb-12">
            <SOSButton 
              onClick={handleSOSClick}
              disabled={!isFormValid || isProcessing}
            />
          </div>

          <div className="bg-card rounded-2xl shadow-lg border-2 border-border p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8">
            <EmergencyTypeSelector
              selectedType={formData?.emergencyType}
              onTypeSelect={handleEmergencyTypeChange}
              error={errors?.emergencyType}
            />

            <div className="border-t border-border" />

            <DescriptionField
              value={formData?.description}
              onChange={handleDescriptionChange}
              error={errors?.description}
            />

            <div className="border-t border-border" />

            <LocationCapture
              location={formData?.location}
              onLocationChange={handleLocationChange}
              error={errors?.location}
            />

            <div className="border-t border-border" />

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate('/dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Cancel
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                fullWidth
                onClick={handleSOSClick}
                disabled={!isFormValid || isProcessing}
                loading={isProcessing}
                iconName="AlertCircle"
                iconPosition="left"
              >
                Send Emergency Alert
              </Button>
            </div>

            {!isFormValid && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm md:text-base text-foreground font-medium mb-1">
                      Complete all required fields
                    </p>
                    <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                      {!formData?.emergencyType && <li>• Select emergency type</li>}
                      {formData?.description?.trim()?.length < 20 && <li>• Provide detailed description (minimum 20 characters)</li>}
                      {(!formData?.location?.latitude || !formData?.location?.longitude) && <li>• Capture or enter your location</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-muted rounded-xl">
            <div className="flex items-start gap-3 md:gap-4">
              <Icon name="Shield" size={24} className="text-primary flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  How Emergency Response Works
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="flex-shrink-0 mt-1 text-success" />
                    <span>Your alert is instantly broadcast to all available helpers within 2km</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="flex-shrink-0 mt-1 text-success" />
                    <span>AI prioritizes your alert based on severity, affected people, and response time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="flex-shrink-0 mt-1 text-success" />
                    <span>Helpers with matching skills (doctors, drivers, first aid) are notified first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="flex-shrink-0 mt-1 text-success" />
                    <span>Real-time tracking shows helper locations and estimated arrival times</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <EmergencyActionButton emergencyActive={false} />

        
      </div>
    </>
  );
};

export default RaiseSOSPage;