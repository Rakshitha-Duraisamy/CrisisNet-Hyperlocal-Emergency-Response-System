import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ stats = {} }) => {
  const defaultStats = {
    activeAlerts: 0,
    inProgress: 0,
    resolved: 0,
    availableHelpers: 0
  };

  const currentStats = { ...defaultStats, ...stats };

  const statCards = [
    {
      label: 'Active Alerts',
      value: currentStats?.activeAlerts,
      icon: 'AlertCircle',
      color: 'error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'In Progress',
      value: currentStats?.inProgress,
      icon: 'Clock',
      color: 'primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Resolved Today',
      value: currentStats?.resolved,
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Available Helpers',
      value: currentStats?.availableHelpers,
      icon: 'Users',
      color: 'secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-xl p-4 md:p-5 hover:shadow-lg transition-all duration-250"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
              <Icon
                name={stat?.icon}
                size={20}
                color={`var(--color-${stat?.color})`}
              />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {stat?.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {stat?.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;