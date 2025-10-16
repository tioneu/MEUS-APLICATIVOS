
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
        <i className="fa-solid fa-file-pen text-blue-600 mr-3"></i>
        OCR de Manuscrito
      </h1>
      <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
        Transcreva textos manuscritos e fórmulas matemáticas de imagens ou PDFs com precisão.
      </p>
    </header>
  );
};
