'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

interface SheetMusicViewerProps {
  fileUrl: string;
}

export default function SheetMusicViewer({ fileUrl }: SheetMusicViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация OSMD
    osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      drawTitle: true,
      drawPartNames: false,
    });

    const loadScore = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await osmdRef.current?.load(fileUrl);
        osmdRef.current?.render();
      } catch (err) {
        console.error('OSMD Load Error:', err);
        setError('Failed to load sheet music. The file might be corrupted or inaccessible.');
      } finally {
        setIsLoading(false);
      }
    };

    loadScore();

    // Очистка при размонтировании
    return () => {
      if (osmdRef.current) {
        osmdRef.current.clear();
      }
    };
  }, [fileUrl]);

  return (
    <div className="w-full flex flex-col items-center">
      {isLoading && <p className="text-blue-600 animate-pulse">Rendering sheet music...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Контейнер, куда OSMD встроит SVG/Canvas с нотами */}
      <div ref={containerRef} className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-inner min-h-[300px]" />
    </div>
  );
}