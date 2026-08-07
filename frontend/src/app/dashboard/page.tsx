'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useTranscriptionSocket } from '@/hooks/useTranscriptionSocket';
import SheetMusicViewer from '@/components/SheetMusicViewer'; // <-- Импорт вьювера

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { lastUpdate } = useTranscriptionSocket();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/audio/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Transcription Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Upload New Audio</h2>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            accept="audio/mpeg, audio/wav" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
          />
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload & Transcribe'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Real-time Status Updates</h2>
        {lastUpdate ? (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-md border border-gray-100 flex justify-between items-center">
              <div>
                <p><strong>Track ID:</strong> {lastUpdate.trackId}</p>
                <p className="mt-1">
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${lastUpdate.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {lastUpdate.status}
                  </span>
                </p>
              </div>
              {lastUpdate.midiUrl && (
                <a href={lastUpdate.midiUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Download MIDI ↓
                </a>
              )}
            </div>

            {/* Рендерим ноты только если статус COMPLETED и есть ссылка на XML */}
            {lastUpdate.status === 'COMPLETED' && lastUpdate.musicXmlUrl && (
              <div className="mt-8 border-t pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Sheet Music</h3>
                <SheetMusicViewer fileUrl={lastUpdate.musicXmlUrl} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent updates. Upload a file to see real-time progress.</p>
        )}
      </div>
    </div>
  );
}