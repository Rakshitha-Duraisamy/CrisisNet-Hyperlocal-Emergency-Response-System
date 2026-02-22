import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PrimaryTabNavigation from '../../components/ui/PrimaryTabNavigation';
import EmergencyActionButton from '../../components/ui/EmergencyActionButton';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import SkillSelector from './components/SkillSelector';
import ResourceSelector from './components/ResourceSelector';
import LocationInput from './components/LocationInput';
import AvailabilityToggle from './components/AvailabilityToggle';
import CertificationUpload from './components/CertificationUpload';
import TermsAgreement from './components/TermsAgreement';
import API from "../../services/api";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    selectedSkills: [],
    selectedResources: [],
    location: {
      address: '',
      latitude: '',
      longitude: ''
    },
    availability: {
      defaultHelper: true,
      pushNotifications: true,
      smsAlerts: false,
      emailNotifications: true
    },
    certifications: [],
    agreements: {
      termsOfService: false,
      privacyPolicy: false,
      liabilityWaiver: false,
      goodSamaritanAct: false
    }
  });

  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.fullName?.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData?.phone?.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData?.password?.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData?.confirmPassword?.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData?.emergencyContact?.trim()) {
        newErrors.emergencyContact = 'Emergency contact name is required';
      }
      if (!formData?.emergencyContactPhone?.trim()) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      }
    }

    if (step === 2) {
      if (formData?.selectedSkills?.length === 0) {
        newErrors.skills = 'Please select at least one skill';
      }
      if (!formData?.location?.address?.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData?.location?.latitude?.toString().trim()) {
        newErrors.latitude = 'Latitude is required';
      }
      if (!formData?.location?.longitude?.toString().trim()) {
        newErrors.longitude = 'Longitude is required';
      }
    }

    if (step === 4) {
      if (!formData?.agreements?.termsOfService) {
        newErrors.termsOfService = 'You must accept the Terms of Service';
      }
      if (!formData?.agreements?.privacyPolicy) {
        newErrors.privacyPolicy = 'You must accept the Privacy Policy';
      }
      if (!formData?.agreements?.liabilityWaiver) {
        newErrors.liabilityWaiver = 'You must accept the Liability Waiver';
      }
      if (!formData?.agreements?.goodSamaritanAct) {
        newErrors.goodSamaritanAct = 'You must acknowledge the Good Samaritan Act';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "helper",
        skills: formData.selectedSkills,
        isAvailable: formData.availability.defaultHelper,
        location: {
          type: "Point",
          coordinates: [
            Number(formData.location.longitude),
            Number(formData.location.latitude),
          ],
        },
      };

      const { data } = await API.post("/auth/register", payload);

      // Save user + token to localStorage
    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        name: data.user.name,
       role: data.user.role,
    }));

      setIsSubmitting(false);
      alert("Registration successful 🎉");
      navigate("/dashboard");

    } catch (error) {
      setIsSubmitting(false);
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const renderStepIndicator = () => (
    <div className="w-full mb-6 md:mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-all duration-250 ${
                  step < currentStep
                    ? 'bg-success text-white'
                    : step === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step < currentStep ? <Icon name="Check" size={18} /> : step}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-2 text-center hidden md:block">
                {step === 1 && 'Personal Info'}
                {step === 2 && 'Skills & Location'}
                {step === 3 && 'Preferences'}
                {step === 4 && 'Agreements'}
              </div>
            </div>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-2 rounded transition-all duration-250 ${
                  step < currentStep ? 'bg-success' : 'bg-muted'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Personal Information
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Tell us about yourself to get started
              </p>
            </div>

            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData?.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors?.fullName}
              required
            />

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="john.doe@example.com"
                value={formData?.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors?.email}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData?.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors?.phone}
                required
              />
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData?.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors?.password}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={formData?.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors?.confirmPassword}
                required
              />
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-border pt-4 md:pt-6 mt-4 md:mt-6">
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Input
                  label="Contact Name"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData?.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  error={errors?.emergencyContact}
                  required
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData?.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  error={errors?.emergencyContactPhone}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 md:space-y-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Skills & Location
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Help us match you with the right emergencies
              </p>
            </div>
            <SkillSelector
              selectedSkills={formData?.selectedSkills}
              onSkillChange={(skills) => setFormData({ ...formData, selectedSkills: skills })}
              errors={errors}
            />
            <ResourceSelector
              selectedResources={formData?.selectedResources}
              onResourceChange={(resources) => setFormData({ ...formData, selectedResources: resources })}
              errors={errors}
            />
            <LocationInput
              location={formData?.location}
              onLocationChange={(location) => setFormData({ ...formData, location })}
              errors={errors}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 md:space-y-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Preferences & Verification
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Customize your emergency response settings
              </p>
            </div>
            <AvailabilityToggle
              availability={formData?.availability}
              onAvailabilityChange={(availability) => setFormData({ ...formData, availability })}
            />
            <CertificationUpload
              selectedSkills={formData?.selectedSkills}
              certifications={formData?.certifications}
              onCertificationChange={(certifications) => setFormData({ ...formData, certifications })}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 md:space-y-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Legal Agreements
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Review and accept the terms to complete registration
              </p>
            </div>
            <TermsAgreement
              agreements={formData?.agreements}
              onAgreementChange={(agreements) => setFormData({ ...formData, agreements })}
              errors={errors}
            />
            <div className="border-2 border-success/30 rounded-lg p-4 md:p-6 bg-success/5">
              <div className="flex items-start gap-3">
                <div className="text-success mt-0.5">
                  <Icon name="CheckCircle2" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-success text-sm md:text-base mb-2">
                    Almost Done!
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    You're about to join the CrisisNet community. Click "Complete Registration" to activate your emergency responder profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Registration - CrisisNet</title>
        <meta name="description" content="Join CrisisNet as an emergency responder. Register your skills, location, and availability to help your community during emergencies." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <PrimaryTabNavigation />

        <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
          <div className="bg-card rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 lg:p-10">
            {renderStepIndicator()}
            {renderStepContent()}

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-8 md:mt-10 pt-6 md:pt-8 border-t border-border">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  iconName="ChevronLeft"
                  iconPosition="left"
                  className="w-full md:w-auto"
                >
                  Previous
                </Button>
              )}

              <div className="flex-1" />

              {currentStep < totalSteps ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  iconName="ChevronRight"
                  iconPosition="right"
                  className="w-full md:w-auto"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  iconName="CheckCircle2"
                  iconPosition="left"
                  className="w-full md:w-auto"
                >
                  Complete Registration
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/dashboard')}
                className="text-primary hover:underline font-medium"
              >
                Go to Dashboard
              </button>
            </p>
          </div>
        </main>

        <EmergencyActionButton />
      </div>
    </>
  );
};

export default RegistrationPage;
