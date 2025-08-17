'use client';

import { useState, useEffect } from 'react';
import { Calendar, FileText, Trash2, Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { reportsAPI } from '@/lib/api';

interface Report {
  _id: string;
  title: string;
  analysis: {
    reportType: string;
    severity: 'low' | 'medium' | 'high';
  };
  createdAt: string;
}

interface ReportsListProps {
  onReportSelect: (reportId: string) => void;
  refreshTrigger: number;
}

export default function ReportsList({ onReportSelect, refreshTrigger }: ReportsListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const data = await reportsAPI.getReports();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error: any) {
      console.error('Error fetching reports:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [refreshTrigger]);

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    setDeleting(reportId);
    try {
      await reportsAPI.deleteReport(reportId);
      setReports(prev => prev.filter(report => report._id !== reportId));
    } catch (error: any) {
      console.error('Error deleting report:', error.response?.data || error.message);
    } finally {
      setDeleting(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
        <p className="text-gray-600">View and manage your analyzed medical reports</p>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-500">Upload your first medical report to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(report.createdAt)}
                      </span>
                      <span className="font-medium">{report.analysis.reportType}</span>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                        report.analysis.severity
                      )}`}
                    >
                      {report.analysis.severity?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReportSelect(report._id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(report._id)}
                      loading={deleting === report._id}
                      disabled={deleting === report._id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}