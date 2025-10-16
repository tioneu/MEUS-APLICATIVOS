import React, { useState } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  onTranscribe: () => void;
  file: File | null;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, onTranscribe, file, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFileChange(null);
  };

  const fileInfo = file ? (
    <div className="text-center text-gray-700 relative">
      <button 
        onClick={handleRemoveFile} 
        className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm border border-gray-200"
        aria-label="Remover arquivo"
      >
        <i className="fa-solid fa-times"></i>
      </button>
      <i className="fa-solid fa-check-circle text-5xl text-green-500 mb-3"></i>
      <p className="font-bold text-lg text-gray-800 break-all px-4">{file.name}</p>
      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
    </div>
  ) : (
    <div className="text-center text-gray-500">
      <i className="fa-solid fa-cloud-arrow-up text-5xl mb-3 text-gray-400"></i>
      <p className="font-semibold">Arraste e solte um arquivo aqui</p>
      <p className="text-sm mt-1">ou</p>
      <label htmlFor="file-upload" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
        selecione um arquivo
      </label>
      <p className="text-xs mt-2 text-gray-400">PNG, JPG, WEBP ou PDF</p>
    </div>
  );
  
  const dropzoneClasses = `
    w-full p-8 border-2 rounded-xl transition-colors duration-300 relative
    ${file ? 'border-solid border-green-500 bg-green-50' :
      isDragging ? 'border-dashed border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50'
    }
  `;

  return (
    <div className="flex flex-col items-center">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={dropzoneClasses}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/png, image/jpeg, image/webp, application/pdf"
          onChange={handleFileSelect}
        />
        {fileInfo}
      </div>
      <button
        onClick={onTranscribe}
        disabled={!file || isLoading}
        className="mt-6 w-full sm:w-auto px-12 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? 'Transcrevendo...' : 'Transcrever Texto'}
      </button>
    </div>
  );
};