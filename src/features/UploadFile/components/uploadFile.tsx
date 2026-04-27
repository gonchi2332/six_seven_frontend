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
        ? "border-red-500 hover:border-red-600"
        : "border-primary hover:border-secondary"
    }`,
    REMOVE_BUTTON:
      "absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md",
    IMAGE: "w-full h-full object-cover",
    PLACEHOLDER: "flex flex-col items-center justify-center p-4 text-center",
    ICON: `w-8 h-8 mb-2 transition-colors ${
      sizeError ? "text-red-500" : "text-primary group-hover:text-secondary"
    }`,
    UPLOAD_TEXT: `font-semibold ${sizeError ? "text-red-500" : "text-primary"}`,
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
              title="Eliminar imagen"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
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
              <p className="text-sm font-semibold text-red-500">
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