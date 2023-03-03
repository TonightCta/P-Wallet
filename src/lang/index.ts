import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import zhCN from './zh_CN.json'

const resources = {
    en: {
        translation: en
    },
    zh_CN: {
        translation: zhCN
    },
};
i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;

