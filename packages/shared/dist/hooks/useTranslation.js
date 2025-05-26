"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslation = void 0;
const user_types_1 = require("../types/user.types");
const translations_1 = require("../localization/translations");
const useTranslation = (currentLanguage = user_types_1.Language.ENGLISH) => {
    const t = translations_1.translations[currentLanguage];
    const switchLanguage = (newLanguage) => {
        // This will be implemented by the component using this hook
        // For now, we return the new language for the component to handle
        return newLanguage;
    };
    return {
        t,
        currentLanguage,
        switchLanguage,
        availableLanguages: Object.values(user_types_1.Language),
    };
};
exports.useTranslation = useTranslation;
//# sourceMappingURL=useTranslation.js.map