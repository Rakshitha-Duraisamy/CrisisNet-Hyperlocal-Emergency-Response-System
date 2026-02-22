import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PrimaryTabNavigation from '../../components/ui/PrimaryTabNavigation';
import EmergencyActionButton from '../../components/ui/EmergencyActionButton';
import EmergencyMap from './components/EmergencyMap';
import AlertsFeed from './components/AlertsFeed';
import FilterPanel from './components/FilterPanel';
import StatsOverview from './components/StatsOverview';

const Dashboard = () => {
  const [currentUser] = useState({
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@crisisnet.com",
    skills: ["doctor", "first_aid"],
    available: true,
    location: { lat: 37.7749, lng: -122.4194 }
  });

  const [alerts, setAlerts] = useState([]);

  const [activeFilters, setActiveFilters] = useState([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = alerts?.filter(alert => {
    if (activeFilters?.length === 0) return true;
    return alert?.requiredSkills?.some(skill => activeFilters?.includes(skill));
  });

  const stats = {
    activeAlerts: alerts?.filter(a => a?.status === 'active')?.length,
    inProgress: alerts?.filter(a => a?.status === 'in-progress')?.length,
    resolved: alerts?.filter(a => a?.status === 'resolved')?.length,
    availableHelpers: 47
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleOfflineModeToggle = () => {
    setOfflineMode(!offlineMode);
  };

  const handleRespond = (alert) => {
    const updatedAlerts = alerts?.map(a =>
      a?.id === alert?.id ? { ...a, status: 'in-progress' } : a
    );
    setAlerts(updatedAlerts);
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
  };

  const handleMarkerClick = (alert) => {
    setSelectedAlert(alert);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleStatusChange = (newStatus) => {
    console.log('User availability changed to:', newStatus);
  };
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/alerts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setAlerts(data.alerts);
        } else {
          console.error(data.message);
        }

      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

  fetchAlerts();
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prevAlerts =>
        prevAlerts?.map(alert => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Command Center - CrisisNet</title>
        <meta name="description" content="Monitor live emergencies and coordinate response efforts within your local area" />
      </Helmet>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <PrimaryTabNavigation 
          currentUser={currentUser}
          onStatusChange={handleStatusChange}
        />

        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Command Center
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Monitor and respond to emergencies in your area
            </p>
          </div>

          <div className="mb-6">
            <StatsOverview stats={stats} />
          </div>

          <div className="mb-6">
            <FilterPanel
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              offlineMode={offlineMode}
              onOfflineModeToggle={handleOfflineModeToggle}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px] md:h-[500px] lg:h-[600px]">
              <EmergencyMap
                alerts={filteredAlerts}
                userLocation={currentUser?.location}
                onMarkerClick={handleMarkerClick}
              />
            </div>

            <div>
              <AlertsFeed
                alerts={filteredAlerts}
                loading={loading}
                onRespond={handleRespond}
                onViewDetails={handleViewDetails}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </main>

        <EmergencyActionButton emergencyActive={false} />
      </div>
    </>
  );
};

export default Dashboard;