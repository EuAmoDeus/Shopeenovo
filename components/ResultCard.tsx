import React from 'react';
import { GeneratedContent } from '../types';
import { CopyButton } from './CopyButton';

interface ResultCardProps {
  content: GeneratedContent;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ content, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Captions Section */}
      <section className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-bold text-orange-800 flex items-center">
            <span className="mr-2">✍️</span> Legendas Geradas
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {[
            { id: 1, text: content.captions.option1 },
            { id: 2, text: content.captions.option2 },
            { id: 3, text: content.captions.option3 }
          ].map((opt) => (
            <div key={opt.id} className="relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={opt.text} />
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mt-1">
                  {opt.id}
                </span>
                <p className="text-gray-700 whitespace-pre-wrap flex-1 p-3 bg-gray-50 rounded-lg text-sm border border-transparent hover:border-orange-200 transition-colors">
                  {opt.text}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">🧠 Melhor legenda:</h3>
            <p className="text-sm text-blue-700">
              <span className="font-bold">{content.captions.bestOption}</span> — {content.captions.reason}
            </p>
          </div>
        </div>
      </section>

      {/* Titles Section */}
      <section className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-bold text-orange-800 flex items-center">
            <span className="mr-2">🎬</span> Títulos Sugeridos
          </h2>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {[content.titles.option1, content.titles.option2, content.titles.option3].map((title, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                 <span className="text-gray-800 font-medium">{title}</span>
                 <CopyButton text={title} />
              </li>
            ))}
          </ul>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
             <h3 className="text-sm font-semibold text-blue-800 mb-1">🧠 Melhor título:</h3>
             <p className="text-sm text-blue-700">
               <span className="font-bold">{content.titles.bestOption}</span> — {content.titles.reason}
             </p>
          </div>
        </div>
      </section>

      {/* Hashtags Section */}
      <section className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-bold text-orange-800 flex items-center">
            <span className="mr-2">🏷️</span> Hashtags
          </h2>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <CopyButton text={content.hashtags.join(' ')} />
            </div>
            <p className="text-orange-600 font-medium text-sm leading-relaxed">
              {content.hashtags.join(' ')}
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-6">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          Criar Novo Conteúdo
        </button>
      </div>
    </div>
  );
};