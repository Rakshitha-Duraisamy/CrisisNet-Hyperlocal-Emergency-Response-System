import React from 'react';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SkillSelector = ({ selectedSkills, onSkillChange, errors }) => {
  const skillOptions = [
    {
      value: 'doctor',
      label: 'Doctor',
      icon: 'Stethoscope',
      description: 'Licensed medical practitioner',
      color: 'text-blue-600'
    },
    {
      value: 'nurse',
      label: 'Nurse',
      icon: 'Heart',
      description: 'Registered nursing professional',
      color: 'text-pink-600'
    },
    {
      value: 'driver',
      label: 'Driver',
      icon: 'Car',
      description: 'Emergency transport provider',
      color: 'text-green-600'
    },
    {
      value: 'first_aid',
      label: 'First Aid Certified',
      icon: 'Cross',
      description: 'Basic emergency care trained',
      color: 'text-red-600'
    },
    {
      value: 'volunteer',
      label: 'General Volunteer',
      icon: 'Users',
      description: 'Community support helper',
      color: 'text-purple-600'
    }
  ];

  const handleSkillToggle = (skillValue) => {
    const updatedSkills = selectedSkills?.includes(skillValue)
      ? selectedSkills?.filter(s => s !== skillValue)
      : [...selectedSkills, skillValue];
    onSkillChange(updatedSkills);
  };

  return (
    <div className="w-full">
      <CheckboxGroup 
        label="Emergency Response Skills" 
        error={errors?.skills}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
          {skillOptions?.map((skill) => (
            <div
              key={skill?.value}
              className={`relative border-2 rounded-lg p-4 transition-all duration-250 ${
                selectedSkills?.includes(skill?.value)
                  ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/30'
              }`}
            >
              <Checkbox
                checked={selectedSkills?.includes(skill?.value)}
                onChange={() => handleSkillToggle(skill?.value)}
                label={
                  <div className="flex items-start gap-3 ml-2">
                    <div className={`mt-0.5 ${skill?.color}`}>
                      <Icon name={skill?.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground text-sm md:text-base">
                        {skill?.label}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground mt-0.5">
                        {skill?.description}
                      </div>
                    </div>
                  </div>
                }
              />
              {selectedSkills?.includes(skill?.value) && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="Check" size={14} color="#FFFFFF" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CheckboxGroup>
      {selectedSkills?.length > 0 && (
        <div className="mt-4 p-3 md:p-4 bg-success/10 border border-success/30 rounded-lg">
          <div className="flex items-center gap-2 text-success">
            <Icon name="CheckCircle2" size={18} />
            <span className="text-sm md:text-base font-medium">
              {selectedSkills?.length} skill{selectedSkills?.length > 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSelector;