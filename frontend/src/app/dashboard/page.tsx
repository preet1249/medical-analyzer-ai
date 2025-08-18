'use client';

import { useState } from 'react';
import Navbar from '@/components/Dashboard/Navbar';
import UploadSection from '@/components/Dashboard/UploadSection';
import ReportsList from '@/components/Dashboard/ReportsList';
import ReportView from '@/components/Dashboard/ReportView';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [refreshReports, setRefreshReports] = useState(0);

  const handleAnalysisComplete = (reportId: string) => {
    setSelectedReportId(reportId);
    setRefreshReports(prev => prev + 1);
  };

  const handleReportSelect = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleBackToList = () => {
    setSelectedReportId(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {selectedReportId ? (
            <ReportView 
              reportId={selectedReportId} 
              onBack={handleBackToList}
            />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <UploadSection onAnalysisComplete={handleAnalysisComplete} />
              </div>
              <div>
                <ReportsList 
                  onReportSelect={handleReportSelect}
                  refreshTrigger={refreshReports}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}