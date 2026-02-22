import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const AlertProcessingModal = ({ isOpen, onClose, alertData }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Validating emergency details', icon: 'FileCheck', duration: 1000 },
    { label: 'Capturing precise location', icon: 'MapPin', duration: 1500 },
    { label: 'Calculating priority score', icon: 'TrendingUp', duration: 1200 },
    { label: 'Searching nearby helpers', icon: 'Users', duration: 2000 },
    { label: 'Matching skills & resources', icon: 'CheckCircle', duration: 1800 },
    { label: 'Sending alert notifications', icon: 'Bell', duration: 1500 }
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    let stepTimer;
    let progressTimer;

    const runStep = (stepIndex) => {
      if (stepIndex >= steps?.length) {
        setTimeout(() => {
          onClose(true);
        }, 500);
        return;
      }

      setCurrentStep(stepIndex);
      const step = steps?.[stepIndex];
      const progressIncrement = 100 / steps?.length;
      const startProgress = stepIndex * progressIncrement;

      let currentProgress = startProgress;
      progressTimer = setInterval(() => {
        currentProgress += progressIncrement / (step?.duration / 50);
        if (currentProgress >= (stepIndex + 1) * progressIncrement) {
          currentProgress = (stepIndex + 1) * progressIncrement;
          clearInterval(progressTimer);
        }
        setProgress(Math.min(currentProgress, 100));
      }, 50);

      stepTimer = setTimeout(() => {
        clearInterval(progressTimer);
        runStep(stepIndex + 1);
      }, step?.duration);
    };

    runStep(0);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border-2 border-border p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
            <Icon name="AlertCircle" size={40} className="text-error animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Processing Emergency Alert
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Connecting you with nearby helpers...
          </p>
        </div>

        <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
          {steps?.map((step, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-all duration-300
                ${index === currentStep 
                  ? 'bg-primary/10 border-2 border-primary' 
                  : index < currentStep 
                    ? 'bg-success/10 border-2 border-success' :'bg-muted border-2 border-transparent'
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center
                ${index === currentStep 
                  ? 'bg-primary/20' 
                  : index < currentStep 
                    ? 'bg-success/20' :'bg-muted'
                }
              `}>
                {index < currentStep ? (
                  <Icon name="Check" size={20} className="text-success" />
                ) : (
                  <Icon 
                    name={step?.icon} 
                    size={20} 
                    className={index === currentStep ? 'text-primary' : 'text-muted-foreground'}
                  />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`
                  text-sm md:text-base font-medium
                  ${index === currentStep 
                    ? 'text-primary' 
                    : index < currentStep 
                      ? 'text-success' :'text-muted-foreground'
                  }
                `}>
                  {step?.label}
                </p>
              </div>
              
              {index === currentStep && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-error transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {alertData && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">Emergency Details:</p>
            <div className="space-y-1 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground capitalize">{alertData?.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-mono text-foreground text-xs">
                  {alertData?.location?.latitude}, {alertData?.location?.longitude}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertProcessingModal;