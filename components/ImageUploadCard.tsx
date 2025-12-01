import React, { useRef } from 'react';
import { UploadedImage } from '../types';

interface ImageUploadCardProps {
  title: string;
  description: string;
  image: UploadedImage | null;
  onImageSelected: (img: UploadedImage) => void;
  onRemove: () => void;
  id: string;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  title,
  description,
  image,
  onImageSelected,
  onRemove,
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract raw base64 and mime type
      const [prefix, base64] = result.split(',');
      const mimeType = prefix.match(/:(.*?);/)?.[1] || file.type;

      onImageSelected({
        file,
        previewUrl: result, // Data URI for display
        base64: base64, // Raw base64 for API
        mimeType: mimeType,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       // Re-use logic (cleaner to extract to function in real app, but inline here for simplicity)
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const [prefix, base64] = result.split(',');
          const mimeType = prefix.match(/:(.*?);/)?.[1] || file.type;
          onImageSelected({
            file,
            previewUrl: result,
            base64,
            mimeType,
          });
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        {title}
      </label>
      
      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-600 hover:border-blue-500 hover:bg-slate-800/50 transition-all cursor-pointer rounded-xl h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-800/30"
        >
          <div className="w-12 h-12 mb-4 text-blue-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-200 font-medium mb-1">Click or Drag to Upload</p>
          <p className="text-slate-500 text-xs">{description}</p>
          <input
            ref={fileInputRef}
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative group h-64 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
          <img
            src={image.previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
             <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Replace
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Remove
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};