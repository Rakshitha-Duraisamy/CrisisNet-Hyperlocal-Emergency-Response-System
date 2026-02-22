import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TermsAgreement = ({ agreements, onAgreementChange, errors }) => {
  const handleToggle = (field) => {
    onAgreementChange({
      ...agreements,
      [field]: !agreements?.[field]
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-2 border-border rounded-lg p-4 md:p-6 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-error/10 flex items-center justify-center">
            <Icon name="ShieldAlert" size={20} className="text-error" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-base md:text-lg">
              Legal Agreements
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Please review and accept the following terms
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            checked={agreements?.termsOfService}
            onChange={() => handleToggle('termsOfService')}
            required
            error={errors?.termsOfService}
            label={
              <span className="text-sm md:text-base">
                I agree to the{' '}
                <button className="text-primary hover:underline font-medium">
                  Terms of Service
                </button>
              </span>
            }
            description="Standard platform usage terms and conditions"
          />

          <Checkbox
            checked={agreements?.privacyPolicy}
            onChange={() => handleToggle('privacyPolicy')}
            required
            error={errors?.privacyPolicy}
            label={
              <span className="text-sm md:text-base">
                I agree to the{' '}
                <button className="text-primary hover:underline font-medium">
                  Privacy Policy
                </button>
              </span>
            }
            description="How we collect, use, and protect your data"
          />

          <Checkbox
            checked={agreements?.liabilityWaiver}
            onChange={() => handleToggle('liabilityWaiver')}
            required
            error={errors?.liabilityWaiver}
            label={
              <span className="text-sm md:text-base">
                I accept the{' '}
                <button className="text-primary hover:underline font-medium">
                  Emergency Response Liability Waiver
                </button>
              </span>
            }
            description="Acknowledgment of risks involved in emergency response"
          />

          <Checkbox
            checked={agreements?.goodSamaritanAct}
            onChange={() => handleToggle('goodSamaritanAct')}
            required
            error={errors?.goodSamaritanAct}
            label={
              <span className="text-sm md:text-base">
                I understand the{' '}
                <button className="text-primary hover:underline font-medium">
                  Good Samaritan Act
                </button>{' '}
                protections and limitations
              </span>
            }
            description="Legal protections for emergency responders"
          />
        </div>
      </div>
      <div className="border-2 border-error/30 rounded-lg p-4 md:p-6 bg-error/5">
        <div className="flex items-start gap-3">
          <div className="text-error mt-0.5">
            <Icon name="AlertCircle" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-error text-sm md:text-base mb-2">
              Important Liability Notice
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              By participating as an emergency responder, you acknowledge that:
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>You will act within your skill level and training</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>You understand the risks of emergency response situations</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>CrisisNet is a coordination platform, not a licensed emergency service</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>You should always call 911 for life-threatening emergencies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAgreement;