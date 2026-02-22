import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import UserStatusIndicator from './UserStatusIndicator';

const PrimaryTabNavigation = ({ currentUser = null, onStatusChange = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Command Center',
      path: '/dashboard',
      icon: 'Map',
      tooltip: 'Monitor live emergencies and coordinate response'
    },
    {
      label: 'My Profile',
      path: '/registration-page',
      icon: 'User',
      tooltip: 'Manage skills and availability status'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="primary-tab-navigation">
        <div className="primary-tab-navigation-container">
          <div className="primary-tab-navigation-logo">
            <div className="primary-tab-navigation-logo-icon">
              <Icon name="AlertTriangle" size={24} color="var(--color-primary)" />
            </div>
            <span className="primary-tab-navigation-logo-text">CrisisNet</span>
          </div>

          <div className="primary-tab-navigation-menu">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`primary-tab-navigation-item ${isActive(item?.path) ? 'active' : ''}`}
                title={item?.tooltip}
                aria-label={item?.label}
                aria-current={isActive(item?.path) ? 'page' : undefined}
              >
                <Icon name={item?.icon} size={20} />
                <span className="hidden md:inline">{item?.label}</span>
              </button>
            ))}
          </div>

          {currentUser && (
            <div className="hidden md:block">
              <UserStatusIndicator 
                currentUser={currentUser}
                onStatusChange={onStatusChange}
              />
            </div>
          )}

          <div className="primary-tab-navigation-mobile">
            <button
              onClick={toggleMobileMenu}
              className="primary-tab-navigation-mobile-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </nav>
      <div className={`primary-tab-navigation-mobile-menu ${mobileMenuOpen ? 'open' : 'closed'}`}>
        <div className="flex flex-col">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`primary-tab-navigation-mobile-item ${isActive(item?.path) ? 'active' : ''}`}
              aria-label={item?.label}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <Icon name={item?.icon} size={24} />
              <span>{item?.label}</span>
            </button>
          ))}
          
          {currentUser && (
            <div className="px-6 py-4 border-t border-border">
              <UserStatusIndicator 
                currentUser={currentUser}
                onStatusChange={onStatusChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PrimaryTabNavigation;