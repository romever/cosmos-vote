import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="fixed top-4 right-4 flex space-x-2">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200
                   ${i18n.language === 'en' 
                     ? 'bg-indigo-600 text-white' 
                     : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
      >
        English
      </button>
      <button
        onClick={() => i18n.changeLanguage('zh')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200
                   ${i18n.language === 'zh' 
                     ? 'bg-indigo-600 text-white' 
                     : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSwitch; 