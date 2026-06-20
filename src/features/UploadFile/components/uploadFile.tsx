import React, { useState, type ChangeEvent, type MouseEvent, useEffect } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  maxSizeMB?: number;
  initialImageUrl?: string | null; 
}

const MAX_SIZE_MB = 2;

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  maxSizeMB = MAX_SIZE_MB,
  initialImageUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl ?? null);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

  const labelBase =
    "group relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden";

  const styles = {
    LABEL: `${labelBase} ${
      sizeError
        ? "border-red-400 hover:border-red-600"
        : "border-primary hover:border-secondary"
    }`,
    REMOVE_BUTTON:
      "absolute top-2 right-2 bg-secondary text-white p-1 rounded-full hover:bg-primary transition-colors shadow-md",
    IMAGE: "w-full h-full object-cover",
    PLACEHOLDER: "flex flex-col items-center justify-center p-4 text-center",
    ICON: `w-8 h-8 mb-2 transition-colors ${
      sizeError ? "text-red-400" : "text-primary group-hover:text-secondary"
    }`,
    UPLOAD_TEXT: `font-semibold ${sizeError ? "text-red-400" : "text-primary"}`,
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("El archivo debe ser png, jpeg o jpg");
      return;
    }

    const sizeMB = file.size / (1024 * 1024);

    if (sizeMB > maxSizeMB) {
      setSizeError(true);
      setPreviewUrl(null);
      onImageSelect(null);
      return;
    }

    setSizeError(false);
    setPreviewUrl(URL.createObjectURL(file));
    onImageSelect(file);
  };

  const handleRemoveImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSizeError(false);
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      <label htmlFor="image-upload" className={styles.LABEL}>
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="Previsualización"
              className={styles.IMAGE}
            />
            <button
              onClick={handleRemoveImage}
              className={styles.REMOVE_BUTTON}
              title="Cambiar imagen"
              type="button"
            >
              Cambiar
            </button>
          </div>
        ) : (
          <div className={styles.PLACEHOLDER}>
            <svg
              aria-hidden="true"
              className={styles.ICON}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {sizeError ? (
              <p className="text-sm font-semibold text-red-400">
                La imagen pesa más de {maxSizeMB}Mb
              </p>
            ) : (
              <p className="mb-1 text-sm text-surface">
                <span className={styles.UPLOAD_TEXT}>
                  Subir foto
                  <br />
                  (png, jpeg o jpg)
                </span>
              </p>
            )}
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