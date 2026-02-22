import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DescriptionField = ({ value, onChange, error }) => {
  const maxLength = 500;
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const newValue = e?.target?.value;
    if (newValue?.length <= maxLength) {
      onChange(newValue);
    }
  };

  const remainingChars = maxLength - value?.length;
  const isNearLimit = remainingChars < 50;

  return (
    <div className="w-full">
      <label className="block text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
        Emergency Description <span className="text-error">*</span>
      </label>
      
      <div className={`
        relative rounded-xl border-2 transition-all duration-250
        ${error ? 'border-error' : isFocused ? 'border-primary' : 'border-border'}
        ${isFocused ? 'shadow-lg' : 'shadow-sm'}
      `}>
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your emergency situation in detail. Include what happened, how many people are affected, and any immediate dangers..."
          rows={6}
          className="w-full px-4 py-3 md:px-5 md:py-4 rounded-xl bg-card text-foreground resize-none focus:outline-none text-sm md:text-base"
          aria-label="Emergency description"
          aria-describedby="description-help"
        />
        
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span 
            className={`
              text-xs md:text-sm font-medium transition-colors
              ${isNearLimit ? 'text-warning' : 'text-muted-foreground'}
            `}
          >
            {remainingChars} characters left
          </span>
        </div>
      </div>
      
      <div className="mt-2 flex items-start gap-2">
        <Icon name="Info" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p id="description-help" className="text-xs md:text-sm text-muted-foreground">
          Provide clear details to help responders understand the situation quickly. Include number of people affected, severity, and any specific needs.
        </p>
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

export default DescriptionField;