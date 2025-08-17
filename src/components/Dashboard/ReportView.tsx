'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface Report {
  _id: string;
  title: string;
  imageUrl: string;
  analysis: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    medicinesSuggested: string[];
    reportType: string;
    severity: 'low' | 'medium' | 'high';
  };
  createdAt: string;
}

interface ReportViewProps {
  reportId: string;
  onBack: () => void;
}

export default function ReportView({ reportId, onBack }: ReportViewProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/reports/${reportId}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Report fetch response:', data);
        if (data.success) {
          setReport(data.data);
        } else {
          console.error('Report fetch failed:', data.error);
        }
      } else {
        console.error('HTTP error:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportId]);


  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Report not found</p>
        <Button onClick={onBack} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(report.createdAt)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
              <p className="text-gray-600 mt-1">{report.analysis.reportType}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getSeverityColor(
                report.analysis.severity
              )}`}
            >
              {report.analysis.severity?.toUpperCase()} PRIORITY
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{report.analysis.summary}</p>
              </div>

              {report.analysis.keyFindings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h3>
                  <ul className="space-y-2">
                    {report.analysis.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {report.analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.analysis.medicinesSuggested.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Medicine Suggestions</h3>
                  <ul className="space-y-2">
                    {report.analysis.medicinesSuggested.map((medicine, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{medicine}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}