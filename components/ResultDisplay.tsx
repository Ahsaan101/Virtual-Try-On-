import React from 'react';
import { AppStatus } from '../types';

interface ResultDisplayProps {
  status: AppStatus;
  resultImage: string | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ status, resultImage, error }) => {
  if (status === AppStatus.IDLE) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 bg-slate-800/20 rounded-2xl border border-slate-800 p-8 text-center">
        <div className="w-16 h-16 mb-6 opacity-20">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-slate-400 mb-2">Ready to Create</h3>
        <p className="text-sm max-w-xs mx-auto">Upload your cloth and person images, then hit Generate to see the magic.</p>
      </div>
    );
  }

  if (status === AppStatus.LOADING) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-800/20 rounded-2xl border border-slate-800">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-medium text-white animate-pulse">Generating Try-On...</h3>
        <p className="text-slate-400 text-sm mt-2">Mixing pixels with AI magic</p>
      </div>
    );
  }

  if (status === AppStatus.ERROR) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-red-900/10 rounded-2xl border border-red-900/50 p-6 text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-400 mb-2">Generation Failed</h3>
        <p className="text-red-300/70 text-sm">{error || "Something went wrong. Please try again."}</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[400px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative group">
      {resultImage && (
        <>
          <img 
            src={resultImage} 
            alt="Generated Try-On" 
            className="w-full h-full object-contain bg-black/40"
          />
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
              href={resultImage} 
              download="aiedit-pro-result.png"
              className="inline-flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </a>
          </div>
        </>
      )}
    </div>
  );
};