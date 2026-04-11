import React, { useState, type ChangeEvent, type MouseEvent } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
      onImageSelect(file); 
    } else if (file) {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  const handleRemoveImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelect(null); 
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="image-upload" 
        className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-secondary transition-colors overflow-hidden"
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={previewUrl} 
              alt="Previsualización" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md"
              title="Eliminar imagen"
              type="button" 
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <svg aria-hidden="true" className="w-8 h-8 mb-2 text-primary group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-1 text-sm text-surface">
              <span className="font-semibold text-primary">Subir foto</span>
            </p>
          </div>
        )}
        
        <input 
          id="image-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ImageUpload;