import React from 'react';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ResourceSelector = ({ selectedResources, onResourceChange, errors }) => {
  const resourceOptions = [
    {
      value: 'car',
      label: 'Personal Vehicle',
      icon: 'Car',
      description: 'Available for emergency transport',
      color: 'text-blue-600'
    },
    {
      value: 'medical_kit',
      label: 'Medical Kit',
      icon: 'Briefcase',
      description: 'First aid supplies and equipment',
      color: 'text-red-600'
    },
    {
      value: 'tools',
      label: 'Emergency Tools',
      icon: 'Wrench',
      description: 'Rescue and repair equipment',
      color: 'text-orange-600'
    },
    {
      value: 'communication',
      label: 'Communication Device',
      icon: 'Radio',
      description: 'Radio or satellite phone',
      color: 'text-green-600'
    }
  ];

  const handleResourceToggle = (resourceValue) => {
    const updatedResources = selectedResources?.includes(resourceValue)
      ? selectedResources?.filter(r => r !== resourceValue)
      : [...selectedResources, resourceValue];
    onResourceChange(updatedResources);
  };

  return (
    <div className="w-full">
      <CheckboxGroup 
        label="Available Resources" 
        error={errors?.resources}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
          {resourceOptions?.map((resource) => (
            <div
              key={resource?.value}
              className={`relative border-2 rounded-lg p-4 transition-all duration-250 ${
                selectedResources?.includes(resource?.value)
                  ? 'border-secondary bg-secondary/5' :'border-border bg-card hover:border-secondary/30'
              }`}
            >
              <Checkbox
                checked={selectedResources?.includes(resource?.value)}
                onChange={() => handleResourceToggle(resource?.value)}
                label={
                  <div className="flex items-start gap-3 ml-2">
                    <div className={`mt-0.5 ${resource?.color}`}>
                      <Icon name={resource?.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-sm md:text-base">
                        {resource?.label}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground mt-0.5">
                        {resource?.description}
                      </div>
                    </div>
                  </div>
                }
              />
              {selectedResources?.includes(resource?.value) && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <Icon name="Check" size={14} color="#FFFFFF" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CheckboxGroup>
      {selectedResources?.length > 0 && (
        <div className="mt-4 p-3 md:p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
          <div className="flex items-center gap-2 text-secondary">
            <Icon name="Package" size={18} />
            <span className="text-sm md:text-base font-medium">
              {selectedResources?.length} resource{selectedResources?.length > 1 ? 's' : ''} available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceSelector;