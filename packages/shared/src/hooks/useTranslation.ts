import { Language } from '../types/user.types';
import { translations, Translations } from '../localization/translations';

export const useTranslation = (currentLanguage: Language = Language.ENGLISH) => {
  const t: Translations = translations[currentLanguage];
  
  const switchLanguage = (newLanguage: Language) => {
    // This will be implemented by the component using this hook
    // For now, we return the new language for the component to handle
    return newLanguage;
  };
  
  return {
    t,
    currentLanguage,
    switchLanguage,
    availableLanguages: Object.values(Language),
  };
}; 