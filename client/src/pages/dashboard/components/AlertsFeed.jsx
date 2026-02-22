import React from 'react';
import Icon from '../../../components/AppIcon';
import AlertCard from './AlertCard';

const AlertsFeed = ({ 
  alerts = [], 
  loading = false,
  onRespond = null,
  onViewDetails = null,
  onRefresh = null
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading emergency alerts...</p>
      </div>
    );
  }

  if (alerts?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Active Emergencies
          </h3>
          <p className="text-sm text-muted-foreground">
            All clear in your area. Stay prepared for any situation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Bell" size={20} color="var(--color-primary)" />
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Live Alerts Feed
          </h2>
          <span className="px-2 py-1 bg-error/10 text-error rounded-full text-xs font-medium">
            {alerts?.filter(a => a?.status === 'active')?.length} Active
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-muted rounded-lg transition-all"
          aria-label="Refresh alerts"
        >
          <Icon name="RefreshCw" size={20} color="var(--color-muted-foreground)" />
        </button>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
        {alerts?.map((alert) => (
          <AlertCard
            key={alert?.id}
            alert={alert}
            onRespond={onRespond}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default AlertsFeed;