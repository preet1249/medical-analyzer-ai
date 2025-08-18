'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { reportsAPI } from '@/lib/api';

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
    severity: 'low' | 'medium' | 'moderate' | 'high';
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
      const data = await reportsAPI.getReport(reportId);
      console.log('Report fetch response:', data);
      if (data.success) {
        setReport(data.data);
      } else {
        console.error('Report fetch failed:', data.error);
      }
    } catch (error: any) {
      console.error('Error fetching report:', error.response?.data || error.message);
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
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
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
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${report.imageUrl}`}
                alt={report.title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', `${process.env.NEXT_PUBLIC_API_URL}${report.imageUrl}`);
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  // Show fallback div
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', `${process.env.NEXT_PUBLIC_API_URL}${report.imageUrl}`);
                }}
              />
              <div 
                className="hidden w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center"
                style={{ display: 'none' }}
              >
                <div className="text-center p-6">
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Medical Report Image</p>
                  <p className="text-gray-400 text-xs mt-1">Image could not be loaded</p>
                </div>
              </div>
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