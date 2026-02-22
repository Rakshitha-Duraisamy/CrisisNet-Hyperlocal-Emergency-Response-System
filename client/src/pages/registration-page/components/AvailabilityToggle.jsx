import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AvailabilityToggle = ({ availability, onAvailabilityChange }) => {
  const handleToggle = (field) => {
    onAvailabilityChange({
      ...availability,
      [field]: !availability?.[field]
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-2 border-border rounded-lg p-4 md:p-6 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-base md:text-lg">
              Availability Settings
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Control when you receive emergency alerts
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Checkbox
            checked={availability?.defaultHelper}
            onChange={() => handleToggle('defaultHelper')}
            label="Set as default helper status"
            description="Automatically mark yourself as available when you log in"
          />

          <Checkbox
            checked={availability?.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
            label="Enable push notifications"
            description="Receive instant alerts for nearby emergencies"
          />

          <Checkbox
            checked={availability?.smsAlerts}
            onChange={() => handleToggle('smsAlerts')}
            label="Enable SMS alerts"
            description="Get text messages for critical emergencies (offline mode)"
          />

          <Checkbox
            checked={availability?.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
            label="Enable email notifications"
            description="Receive daily summary of emergency activities"
          />
        </div>
      </div>
      <div className="border-2 border-warning/30 rounded-lg p-4 md:p-6 bg-warning/5">
        <div className="flex items-start gap-3">
          <div className="text-warning mt-0.5">
            <Icon name="AlertTriangle" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-warning text-sm md:text-base mb-2">
              Response Time Commitment
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              By enabling availability, you commit to responding within 5 minutes of receiving an emergency alert. Your response time affects your helper rating and priority matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityToggle;