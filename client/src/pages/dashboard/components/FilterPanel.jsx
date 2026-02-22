import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ 
  activeFilters = [], 
  onFilterChange = null,
  onClearFilters = null,
  offlineMode = false,
  onOfflineModeToggle = null
}) => {
  const skillFilters = [
    { value: 'doctor', label: 'Doctor', icon: 'Stethoscope' },
    { value: 'nurse', label: 'Nurse', icon: 'Heart' },
    { value: 'driver', label: 'Driver', icon: 'Car' },
    { value: 'first_aid', label: 'First Aid', icon: 'Bandage' },
    { value: 'volunteer', label: 'Volunteer', icon: 'Users' }
  ];

  const isFilterActive = (filterValue) => {
    return activeFilters?.includes(filterValue);
  };

  const handleFilterToggle = (filterValue) => {
    if (onFilterChange) {
      if (isFilterActive(filterValue)) {
        onFilterChange(activeFilters?.filter(f => f !== filterValue));
      } else {
        onFilterChange([...activeFilters, filterValue]);
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          Filter by Skills
        </h3>
        {activeFilters?.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 mb-4">
        {skillFilters?.map((filter) => (
          <button
            key={filter?.value}
            onClick={() => handleFilterToggle(filter?.value)}
            className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg border-2 transition-all duration-250 ${
              isFilterActive(filter?.value)
                ? 'border-primary bg-primary/10' :'border-border bg-background hover:border-primary/50'
            }`}
            aria-label={`Filter by ${filter?.label}`}
            aria-pressed={isFilterActive(filter?.value)}
          >
            <Icon
              name={filter?.icon}
              size={20}
              color={isFilterActive(filter?.value) ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
            />
            <span className={`text-xs md:text-sm font-medium ${
              isFilterActive(filter?.value) ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {filter?.label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between p-3 md:p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Icon
            name={offlineMode ? 'WifiOff' : 'Wifi'}
            size={20}
            color={offlineMode ? 'var(--color-warning)' : 'var(--color-success)'}
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {offlineMode ? 'Offline Mode' : 'Online Mode'}
            </p>
            <p className="text-xs text-muted-foreground">
              {offlineMode ? 'SMS network simulation active' : 'Real-time updates enabled'}
            </p>
          </div>
        </div>
        <button
          onClick={onOfflineModeToggle}
          className={`relative w-12 h-6 rounded-full transition-all duration-250 ${
            offlineMode ? 'bg-warning' : 'bg-success'
          }`}
          aria-label="Toggle offline mode"
          aria-pressed={offlineMode}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-250 ${
              offlineMode ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;