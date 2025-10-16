import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { transcribeHandwriting } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setTranscribedText('');
    setError(null);
  };

  const handleTranscription = useCallback(async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo primeiro.');
      return;
    }

    if (file.type === 'application/pdf') {
      setLoadingMessage('Analisando o PDF... Isso pode levar alguns instantes.');
    } else {
      setLoadingMessage('Analisando a imagem...');
    }

    setIsLoading(true);
    setError(null);
    setTranscribedText('');

    try {
      const { base64, mimeType } = await fileToBase64(file);
      const result = await transcribeHandwriting(base64, mimeType);
      setTranscribedText(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido durante a transcrição.');
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const handleDownloadRtf = () => {
    if (!transcribedText) return;

    // Escapa caracteres especiais de RTF e converte quebras de linha para o formato RTF
    const escapedText = transcribedText
      .replace(/\\/g, '\\\\')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/\n/g, '\\par\r\n');

    // Cria o conteúdo RTF completo com cabeçalho e texto
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}}
\\fs24
${escapedText}
}`;

    try {
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = url;
      link.download = 'transcricao.rtf';
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar o arquivo .rtf:", err);
      setError("Ocorreu um erro ao criar o arquivo para download.");
    }
  };
  
  const handleClear = () => {
    setFile(null);
    setTranscribedText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <FileUpload onFileChange={handleFileChange} onTranscribe={handleTranscription} file={file} isLoading={isLoading} />

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {isLoading && <Loader message={loadingMessage} />}

          {transcribedText && !isLoading && (
            <ResultDisplay text={transcribedText} onDownload={handleDownloadRtf} onClear={handleClear} />
          )}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Desenvolvido com React, Tailwind CSS e Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;