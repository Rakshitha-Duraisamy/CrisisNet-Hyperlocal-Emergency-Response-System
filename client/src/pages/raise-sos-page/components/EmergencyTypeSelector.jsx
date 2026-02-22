import React from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyTypeSelector = ({ selectedType, onTypeSelect, error }) => {
  const emergencyTypes = [
    {
      value: 'medical',
      label: 'Medical Emergency',
      icon: 'Heart',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Health crisis, injury, or medical assistance needed'
    },
    {
      value: 'accident',
      label: 'Accident',
      icon: 'Car',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Vehicle collision or traffic incident'
    },
    {
      value: 'fire',
      label: 'Fire Emergency',
      icon: 'Flame',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      description: 'Fire outbreak or smoke detection'
    },
    {
      value: 'flood',
      label: 'Flood/Water Emergency',
      icon: 'Droplets',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Water logging, flooding, or water-related crisis'
    }
  ];

  return (
    <div className="w-full">
      <label className="block text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
        Emergency Type <span className="text-error">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {emergencyTypes?.map((type) => (
          <button
            key={type?.value}
            type="button"
            onClick={() => onTypeSelect(type?.value)}
            className={`
              relative p-4 md:p-5 rounded-xl border-2 transition-all duration-250
              ${selectedType === type?.value 
                ? `${type?.borderColor} ${type?.bgColor} shadow-lg scale-[1.02]` 
                : 'border-border bg-card hover:border-muted-foreground hover:shadow-md'
              }
            `}
            aria-label={`Select ${type?.label}`}
            aria-pressed={selectedType === type?.value}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className={`
                flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center
                ${selectedType === type?.value ? type?.bgColor : 'bg-muted'}
              `}>
                <Icon 
                  name={type?.icon} 
                  size={24} 
                  className={selectedType === type?.value ? type?.color : 'text-muted-foreground'}
                />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className={`
                  text-base md:text-lg font-semibold mb-1
                  ${selectedType === type?.value ? type?.color : 'text-foreground'}
                `}>
                  {type?.label}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {type?.description}
                </p>
              </div>
              
              {selectedType === type?.value && (
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full ${type?.bgColor} flex items-center justify-center`}>
                    <Icon name="Check" size={16} className={type?.color} />
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-2">
          <Icon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default EmergencyTypeSelector;