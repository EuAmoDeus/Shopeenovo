import React, { useState } from 'react';
import { generateSocialContent, extractProductInfo } from './services/geminiService';
import { AppState, ProductInfo, GeneratedContent } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [time, setTime] = useState<number>(30);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [productInfo, setProductInfo] = useState<ProductInfo>({ title: '', description: '' });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!url) {
      setErrorMsg("Por favor, cole um link da Shopee primeiro.");
      return;
    }

    setAppState(AppState.EXTRACTING);
    setErrorMsg(null);

    try {
      const info = await extractProductInfo(url);
      setProductInfo({
        title: info.title || '',
        description: info.description || ''
      });
      setAppState(AppState.IDLE);
    } catch (error) {
      console.error(error);
      setErrorMsg("Não foi possível extrair dados deste link. Tente preencher manualmente.");
      setAppState(AppState.IDLE);
    }
  };

  const handleGenerate = async () => {
    if (!productInfo.title || !productInfo.description) {
      setErrorMsg("Título e descrição são obrigatórios.");
      return;
    }

    setAppState(AppState.GENERATING);
    setErrorMsg(null);

    try {
      const content = await generateSocialContent(productInfo, time);
      setGeneratedContent(content);
      setAppState(AppState.DONE);
    } catch (error) {
      console.error(error);
      setErrorMsg("Erro ao gerar conteúdo. Tente novamente.");
      setAppState(AppState.IDLE);
    }
  };

  const resetApp = () => {
    // Keep the inputs, just clear results
    setGeneratedContent(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  const clearAll = () => {
    setUrl('');
    setTime(30);
    setProductInfo({ title: '', description: '' });
    setGeneratedContent(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h1 className="text-xl font-bold tracking-tight">Shopee Legend Maker</h1>
          </div>
          <div className="text-xs bg-orange-700 bg-opacity-30 px-3 py-1 rounded-full">
            Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-start animate-fade-in">
             <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Input Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Dados do Produto</h2>
            {generatedContent && (
               <button onClick={clearAll} className="text-sm text-gray-400 hover:text-red-500">
                 Limpar tudo
               </button>
            )}
          </div>

          <div className="space-y-6">
            
            {/* Link Auto-fill Section */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <label className="block text-xs font-bold text-orange-800 uppercase tracking-wide mb-2">
                Importar da Shopee (Opcional)
              </label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Cole o link aqui para preencher automaticamente..." 
                  className="flex-1 px-4 py-2 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white placeholder-gray-400"
                />
                <button 
                  onClick={handleExtract}
                  disabled={appState === AppState.EXTRACTING || !url}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center"
                >
                  {appState === AppState.EXTRACTING ? <LoadingSpinner /> : 'Preencher'}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Produto</label>
              <input
                type="text"
                value={productInfo.title}
                onChange={(e) => setProductInfo({ ...productInfo, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                placeholder="Ex: Mini Aspirador Portátil Recarregável"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={productInfo.description}
                onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none bg-white"
                placeholder="Descreva o produto, suas funções e benefícios..."
              />
            </div>

            {/* Time Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo do Vídeo: <span className="font-bold text-orange-600">{time}s</span>
              </label>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="1"
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Curto (5s)</span>
                <span>Médio (45s)</span>
                <span>Longo (90s)</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={appState === AppState.GENERATING || !productInfo.title}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all transform active:scale-[0.99] flex items-center justify-center space-x-2 mt-2"
            >
              {appState === AppState.GENERATING ? (
                <>
                  <LoadingSpinner />
                  <span>Criando Legendas Mágicas...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">✨</span>
                  <span>Gerar Conteúdo</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results Section */}
        {generatedContent && (
          <div id="results">
            <ResultCard content={generatedContent} onReset={resetApp} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;