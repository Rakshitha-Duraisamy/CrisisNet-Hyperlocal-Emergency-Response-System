import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CertificationUpload = ({ selectedSkills, certifications, onCertificationChange }) => {
  const [uploadingFor, setUploadingFor] = useState(null);

  const medicalSkills = selectedSkills?.filter(skill => 
    ['doctor', 'nurse', 'first_aid']?.includes(skill)
  );

  const handleFileUpload = (skillType) => {
    setUploadingFor(skillType);
    
    setTimeout(() => {
      const mockCertification = {
        skillType,
        fileName: `${skillType}_certificate.pdf`,
        uploadDate: new Date()?.toISOString(),
        verified: false
      };
      
      onCertificationChange([...certifications, mockCertification]);
      setUploadingFor(null);
    }, 1500);
  };

  const handleRemoveCertification = (skillType) => {
    onCertificationChange(certifications?.filter(cert => cert?.skillType !== skillType));
  };

  const getCertificationForSkill = (skillType) => {
    return certifications?.find(cert => cert?.skillType === skillType);
  };

  const getSkillLabel = (skillType) => {
    const labels = {
      doctor: 'Medical License',
      nurse: 'Nursing Certificate',
      first_aid: 'First Aid Certification'
    };
    return labels?.[skillType] || skillType;
  };

  if (medicalSkills?.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="border-2 border-border rounded-lg p-4 md:p-6 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Icon name="FileCheck" size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-base md:text-lg">
              Skill Verification
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Upload certificates for medical skills (optional but recommended)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {medicalSkills?.map((skill) => {
            const certification = getCertificationForSkill(skill);
            const isUploading = uploadingFor === skill;

            return (
              <div
                key={skill}
                className="border border-border rounded-lg p-4 bg-muted/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon name="Award" size={18} className="text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm md:text-base">
                        {getSkillLabel(skill)}
                      </div>
                      {certification && (
                        <div className="text-xs md:text-sm text-muted-foreground mt-0.5">
                          {certification?.fileName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {certification ? (
                      <>
                        <div className="flex items-center gap-1 text-success text-xs md:text-sm">
                          <Icon name="CheckCircle2" size={16} />
                          <span className="hidden md:inline">Uploaded</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCertification(skill)}
                          iconName="Trash2"
                        >
                          <span className="hidden md:inline">Remove</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload(skill)}
                        loading={isUploading}
                        iconName="Upload"
                        iconPosition="left"
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <p className="text-xs md:text-sm text-blue-900">
              Verified medical professionals receive priority matching for medical emergencies and higher trust ratings from emergency requesters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationUpload;