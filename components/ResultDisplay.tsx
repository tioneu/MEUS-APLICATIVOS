import React from 'react';

interface ResultDisplayProps {
  text: string;
  onDownload: () => void;
  onClear: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ text, onDownload, onClear }) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Texto Transcrito</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300"
          >
            <i className="fa-solid fa-file-word mr-2"></i>
            Baixar .rtf
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors duration-300"
          >
            <i className="fa-solid fa-eraser mr-2"></i>
            Limpar
          </button>
        </div>
      </div>
      <div className="w-full p-6 bg-gray-50 border border-gray-200 rounded-lg min-h-[200px] whitespace-pre-wrap font-mono text-gray-700">
        {text}
      </div>
    </div>
  );
};