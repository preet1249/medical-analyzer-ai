'use client';

import { useState, useRef } from 'react';
import { Upload, FileImage, X, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatFileSize } from '@/lib/utils';
import { uploadAPI, analysisAPI } from '@/lib/api';

interface UploadSectionProps {
  onAnalysisComplete: (reportId: string) => void;
}

export default function UploadSection({ onAnalysisComplete }: UploadSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!validTypes.includes(file.type)) {
        setError(`${file.name} is not a valid image format. Please use JPEG, PNG, JPG, or WebP.`);
        return false;
      }
      
      if (file.size > maxSize) {
        setError(`${file.name} is too large. Maximum file size is 50MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setError('');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fileChangeEvent = {
      target: { files: files }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileSelect(fileChangeEvent);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!selectedFiles.length || !title.trim()) {
      setError('Please select at least one file and provide a title.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      for (const file of selectedFiles) {
        const uploadData = await uploadAPI.uploadFile(file);
        
        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Upload failed');
        }

        setUploading(false);
        setAnalyzing(true);
        setProcessingStep('AI analyzing report...');

        const analysisData = await analysisAPI.analyzeReport(uploadData.data.url, title.trim());
        
        if (analysisData.success) {
          onAnalysisComplete(analysisData.data.reportId);
          setSelectedFiles([]);
          setTitle('');
          setProcessingStep('');
        } else {
          throw new Error(analysisData.error || 'Analysis failed');
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setProcessingStep('');
    }
  };

  const isProcessing = uploading || analyzing;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Upload Medical Report</h2>
        <p className="text-gray-600">Upload your medical reports for AI-powered analysis</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Input
            label="Report Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Blood Test Results - January 2024"
            disabled={isProcessing}
          />

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your medical reports here
            </p>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
            <p className="text-sm text-gray-400">
              Supports: JPEG, PNG, WebP (max 50MB each)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isProcessing}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Selected Files:</h3>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileImage className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFiles.length || !title.trim() || isProcessing}
            loading={isProcessing}
            className="w-full"
            size="lg"
          >
            {uploading && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading Images...
              </>
            )}
            {analyzing && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {processingStep || 'Analyzing Report with AI...'}
              </>
            )}
            {!isProcessing && 'Analyze Report'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}