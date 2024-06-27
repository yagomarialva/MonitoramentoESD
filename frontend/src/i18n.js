import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import enJSON from './locate/en.json'
import ptJSON from './locate/pt.json'
i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    pt: { ...ptJSON },
  },
  lng: "en",
});