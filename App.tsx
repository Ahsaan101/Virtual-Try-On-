import React, { useState } from 'react';
import { ImageUploadCard } from './components/ImageUploadCard';
import { ResultDisplay } from './components/ResultDisplay';
import { generateVirtualTryOn } from './services/geminiService';
import { UploadedImage, AppStatus } from './types';

const App: React.FC = () => {
  const [clothImage, setClothImage] = useState<UploadedImage | null>(null);
  const [personImage, setPersonImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!clothImage || !personImage) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateVirtualTryOn(
        clothImage.base64,
        clothImage.mimeType,
        personImage.base64,
        personImage.mimeType
      );
      setGeneratedImage(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const isReady = clothImage !== null && personImage !== null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                V-Try
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white">Virtual Try-On</h1>
              <p className="text-slate-400">Upload a cloth item and a model photo. We'll merge them naturally.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-6">
              <ImageUploadCard
                id="cloth-upload"
                title="1. The Clothing"
                description="Upload the shirt, dress, or outfit."
                image={clothImage}
                onImageSelected={setClothImage}
                onRemove={() => setClothImage(null)}
              />

              <div className="w-full flex justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                  </svg>
                </div>
              </div>

              <ImageUploadCard
                id="person-upload"
                title="2. The Model"
                description="Upload a photo of the person."
                image={personImage}
                onImageSelected={setPersonImage}
                onRemove={() => setPersonImage(null)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isReady || status === AppStatus.LOADING}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98]
                flex items-center justify-center gap-2
                ${isReady && status !== AppStatus.LOADING
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-900/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}
              `}
            >
              {status === AppStatus.LOADING ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Try-On
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-200">Result</h2>
                {status === AppStatus.SUCCESS && (
                  <span className="text-green-400 text-sm flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded-full border border-green-900/50">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Success
                  </span>
                )}
             </div>
             
             <div className="flex-grow">
               <ResultDisplay status={status} resultImage={generatedImage} error={error} />
             </div>
          </div>

        </div>
      </main>
      
      <footer className="border-t border-slate-800 bg-slate-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} V-Try. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;