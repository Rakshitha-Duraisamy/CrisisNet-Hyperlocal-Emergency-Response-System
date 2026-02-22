import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({ alert, onRespond = null, onViewDetails = null }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-error';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-error/10';
      case 'Medium':
        return 'bg-warning/10';
      case 'Low':
        return 'bg-success/10';
      default:
        return 'bg-muted';
    }
  };

  const getEmergencyIcon = (type) => {
    switch (type) {
      case 'Medical':
        return 'Heart';
      case 'Accident':
        return 'Car';
      case 'Fire':
        return 'Flame';
      case 'Flood':
        return 'Droplets';
      default:
        return 'AlertTriangle';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-error/10', text: 'text-error', label: 'Active' },
      'in-progress': { bg: 'bg-primary/10', text: 'text-primary', label: 'In Progress' },
      resolved: { bg: 'bg-success/10', text: 'text-success', label: 'Resolved' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 lg:p-6 hover:shadow-lg transition-all duration-250">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${getPriorityBg(alert?.priority)}`}>
            <Icon name={getEmergencyIcon(alert?.type)} size={20} color={getPriorityColor(alert?.priority)?.replace('text-', 'var(--color-')} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-foreground line-clamp-1">
              {alert?.type} Emergency
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {formatTimeAgo(alert?.timestamp)}
            </p>
          </div>
        </div>
        {getStatusBadge(alert?.status)}
      </div>
      <p className="text-sm md:text-base text-foreground mb-4 line-clamp-2">
        {alert?.description}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" />
          <span className="text-xs md:text-sm text-muted-foreground">
            {alert?.distance} km away
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Users" size={16} color="var(--color-muted-foreground)" />
          <span className="text-xs md:text-sm text-muted-foreground">
            {alert?.peopleAffected} affected
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs md:text-sm font-medium text-muted-foreground">
          Required:
        </span>
        {alert?.requiredSkills?.map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${getPriorityBg(alert?.priority)}`}>
        <Icon name="TrendingUp" size={16} color={getPriorityColor(alert?.priority)?.replace('text-', 'var(--color-')} />
        <span className={`text-xs md:text-sm font-semibold ${getPriorityColor(alert?.priority)}`}>
          {alert?.priority} Priority
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          Score: {alert?.priorityScore}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          fullWidth
          iconName="Phone"
          iconPosition="left"
          onClick={() => onRespond && onRespond(alert)}
          disabled={alert?.status === 'resolved'}
        >
          Respond Now
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          onClick={() => onViewDetails && onViewDetails(alert)}
        />
      </div>
    </div>
  );
};

export default AlertCard;