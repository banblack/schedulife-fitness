
/**
 * Analytics Page
 * 
 * Main analytics page that provides comprehensive insights into user
 * workout patterns, progress tracking, and personalized recommendations.
 * 
 * This page serves as the central hub for all analytics-related functionality
 * in the fitness application.
 */

import React, { useEffect } from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';

const Analytics: React.FC = () => {
  const { trackEvent } = useAnalytics();

  // Track page visit
  useEffect(() => {
    trackEvent('analytics_page_view', {
      timestamp: new Date().toISOString(),
      page: 'analytics'
    });
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background">
      <AnalyticsDashboard />
    </div>
  );
};

export default Analytics;
