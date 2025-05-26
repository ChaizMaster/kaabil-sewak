import { Language } from '../types/user.types';
import { Translations } from '../localization/translations';
export declare const useTranslation: (currentLanguage?: Language) => {
    t: Translations;
    currentLanguage: Language;
    switchLanguage: (newLanguage: Language) => Language;
    availableLanguages: Language[];
};
//# sourceMappingURL=useTranslation.d.ts.map