import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "mr", label: "Marathi", native: "मराठी", dir: "ltr" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "zh", label: "Chinese", native: "中文", dir: "ltr" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

// TTS voice hint per language (used as `instructions` for OpenAI TTS).
export const TTS_INSTRUCTIONS: Record<LangCode, string> = {
  en: "Speak clearly at a natural pace, warm and informative tone.",
  hi: "स्पष्ट, शांत और मैत्रीपूर्ण स्वर में हिन्दी में पढ़ें। Speak in Hindi.",
  mr: "स्पष्ट आणि शांत मराठी उच्चारात वाचा. Speak in Marathi.",
  es: "Lee en español con tono claro y natural. Speak in Spanish.",
  ar: "اقرأ باللغة العربية الفصحى بنبرة واضحة وهادئة. Speak in Modern Standard Arabic.",
  zh: "用清晰、温暖的普通话朗读。Speak in Mandarin Chinese.",
};

// Minimal translation dictionary. English keys are the source of truth;
// missing translations fall back to English.
const resources = {
  en: {
    translation: {
      nav: {
        dashboard: "Dashboard", news: "News", alerts: "Alerts", travel: "Travel",
        checklist: "Checklist", saved: "Saved", settings: "Settings", knowledge: "Knowledge",
      },
      common: {
        signOut: "Sign out", readAloud: "Read aloud", stop: "Stop",
        loading: "Loading…", refresh: "Refresh", search: "Search",
        home: "Home", setAsHome: "Set as home", change: "Change",
      },
      weather: {
        now: "Now in", feelsLike: "Feels like", high: "H", low: "L",
        humidity: "Humidity", wind: "Wind", uv: "UV Index",
        sunrise: "Sunrise", sunset: "Sunset",
      },
      alerts: { active: "Active alert", noAlerts: "No active alerts", severity: "Severity" },
      notifications: { title: "Recent notifications", empty: "No notifications for this location right now." },
      knowledge: { title: "Knowledge Hub", before: "Before", during: "During", after: "After", doNot: "Do NOT", sources: "Sources" },
      settings: {
        title: "Settings", location: "Location", theme: "Theme", language: "Language",
        notifications: "Notifications", mirrorNote: "This mirrors the location selected on your dashboard.",
      },
      theme: { light: "Light", dark: "Dark", system: "System" },
    },
  },
  hi: {
    translation: {
      nav: {
        dashboard: "डैशबोर्ड", news: "समाचार", alerts: "चेतावनी", travel: "यात्रा",
        checklist: "चेकलिस्ट", saved: "सहेजा गया", settings: "सेटिंग्स", knowledge: "जानकारी",
      },
      common: {
        signOut: "साइन आउट", readAloud: "पढ़कर सुनाएँ", stop: "रोकें",
        loading: "लोड हो रहा है…", refresh: "रीफ्रेश", search: "खोजें",
        home: "मुख्य", setAsHome: "मुख्य बनाएँ", change: "बदलें",
      },
      weather: {
        now: "अभी", feelsLike: "महसूस", high: "अधि.", low: "न्यून.",
        humidity: "नमी", wind: "हवा", uv: "यूवी इंडेक्स",
        sunrise: "सूर्योदय", sunset: "सूर्यास्त",
      },
      alerts: { active: "सक्रिय चेतावनी", noAlerts: "कोई सक्रिय चेतावनी नहीं", severity: "गंभीरता" },
      notifications: { title: "हाल की सूचनाएँ", empty: "इस स्थान के लिए अभी कोई सूचना नहीं।" },
      knowledge: { title: "जानकारी केंद्र", before: "पहले", during: "दौरान", after: "बाद में", doNot: "यह न करें", sources: "स्रोत" },
      settings: {
        title: "सेटिंग्स", location: "स्थान", theme: "थीम", language: "भाषा",
        notifications: "सूचनाएँ", mirrorNote: "यह आपके डैशबोर्ड पर चयनित स्थान को दर्शाता है।",
      },
      theme: { light: "हल्का", dark: "गहरा", system: "सिस्टम" },
    },
  },
  mr: {
    translation: {
      nav: {
        dashboard: "डॅशबोर्ड", news: "बातम्या", alerts: "इशारे", travel: "प्रवास",
        checklist: "चेकलिस्ट", saved: "जतन केलेले", settings: "सेटिंग्ज", knowledge: "माहिती",
      },
      common: {
        signOut: "साइन आऊट", readAloud: "वाचून दाखवा", stop: "थांबवा",
        loading: "लोड होत आहे…", refresh: "रिफ्रेश", search: "शोधा",
        home: "मुख्य", setAsHome: "मुख्य बनवा", change: "बदला",
      },
      weather: {
        now: "आत्ता", feelsLike: "जाणवते", high: "उच्च", low: "कमी",
        humidity: "आर्द्रता", wind: "वारा", uv: "यूव्ही निर्देशांक",
        sunrise: "सूर्योदय", sunset: "सूर्यास्त",
      },
      alerts: { active: "सक्रिय इशारा", noAlerts: "कोणतेही सक्रिय इशारे नाहीत", severity: "तीव्रता" },
      notifications: { title: "अलीकडील सूचना", empty: "या स्थानासाठी सध्या कोणत्याही सूचना नाहीत." },
      knowledge: { title: "माहिती केंद्र", before: "आधी", during: "दरम्यान", after: "नंतर", doNot: "हे करू नका", sources: "स्रोत" },
      settings: {
        title: "सेटिंग्ज", location: "स्थान", theme: "थीम", language: "भाषा",
        notifications: "सूचना", mirrorNote: "हे तुमच्या डॅशबोर्डवर निवडलेले स्थान दर्शवते.",
      },
      theme: { light: "हलका", dark: "गडद", system: "सिस्टम" },
    },
  },
  es: {
    translation: {
      nav: {
        dashboard: "Panel", news: "Noticias", alerts: "Alertas", travel: "Viajes",
        checklist: "Lista", saved: "Guardado", settings: "Ajustes", knowledge: "Conocimiento",
      },
      common: {
        signOut: "Cerrar sesión", readAloud: "Leer en voz alta", stop: "Detener",
        loading: "Cargando…", refresh: "Actualizar", search: "Buscar",
        home: "Casa", setAsHome: "Fijar como casa", change: "Cambiar",
      },
      weather: {
        now: "Ahora en", feelsLike: "Sensación", high: "Máx", low: "Mín",
        humidity: "Humedad", wind: "Viento", uv: "Índice UV",
        sunrise: "Amanecer", sunset: "Atardecer",
      },
      alerts: { active: "Alerta activa", noAlerts: "Sin alertas activas", severity: "Gravedad" },
      notifications: { title: "Notificaciones recientes", empty: "No hay notificaciones para esta ubicación." },
      knowledge: { title: "Centro de conocimiento", before: "Antes", during: "Durante", after: "Después", doNot: "NO hacer", sources: "Fuentes" },
      settings: {
        title: "Ajustes", location: "Ubicación", theme: "Tema", language: "Idioma",
        notifications: "Notificaciones", mirrorNote: "Refleja la ubicación seleccionada en tu panel.",
      },
      theme: { light: "Claro", dark: "Oscuro", system: "Sistema" },
    },
  },
  ar: {
    translation: {
      nav: {
        dashboard: "لوحة التحكم", news: "الأخبار", alerts: "التنبيهات", travel: "السفر",
        checklist: "قائمة التحقق", saved: "المحفوظ", settings: "الإعدادات", knowledge: "المعرفة",
      },
      common: {
        signOut: "تسجيل الخروج", readAloud: "قراءة بصوت عالٍ", stop: "إيقاف",
        loading: "جارٍ التحميل…", refresh: "تحديث", search: "بحث",
        home: "الرئيسية", setAsHome: "تعيين كرئيسية", change: "تغيير",
      },
      weather: {
        now: "الآن في", feelsLike: "الإحساس", high: "أعلى", low: "أدنى",
        humidity: "الرطوبة", wind: "الرياح", uv: "مؤشر الأشعة",
        sunrise: "الشروق", sunset: "الغروب",
      },
      alerts: { active: "تنبيه نشط", noAlerts: "لا توجد تنبيهات نشطة", severity: "الخطورة" },
      notifications: { title: "الإشعارات الأخيرة", empty: "لا توجد إشعارات لهذا الموقع الآن." },
      knowledge: { title: "مركز المعرفة", before: "قبل", during: "أثناء", after: "بعد", doNot: "لا تفعل", sources: "المصادر" },
      settings: {
        title: "الإعدادات", location: "الموقع", theme: "المظهر", language: "اللغة",
        notifications: "الإشعارات", mirrorNote: "يعكس الموقع المحدد في لوحة التحكم.",
      },
      theme: { light: "فاتح", dark: "داكن", system: "النظام" },
    },
  },
  zh: {
    translation: {
      nav: {
        dashboard: "仪表盘", news: "新闻", alerts: "警报", travel: "旅行",
        checklist: "清单", saved: "已保存", settings: "设置", knowledge: "知识",
      },
      common: {
        signOut: "退出登录", readAloud: "朗读", stop: "停止",
        loading: "加载中…", refresh: "刷新", search: "搜索",
        home: "主页", setAsHome: "设为主页", change: "更改",
      },
      weather: {
        now: "当前", feelsLike: "体感", high: "最高", low: "最低",
        humidity: "湿度", wind: "风速", uv: "紫外线指数",
        sunrise: "日出", sunset: "日落",
      },
      alerts: { active: "活动警报", noAlerts: "没有活动警报", severity: "严重程度" },
      notifications: { title: "最近通知", empty: "此位置暂无通知。" },
      knowledge: { title: "知识中心", before: "之前", during: "期间", after: "之后", doNot: "请勿", sources: "来源" },
      settings: {
        title: "设置", location: "位置", theme: "主题", language: "语言",
        notifications: "通知", mirrorNote: "这与您在仪表盘上选择的位置同步。",
      },
      theme: { light: "浅色", dark: "深色", system: "系统" },
    },
  },
};

const STORAGE_KEY = "mausam.lang";

function initialLang(): LangCode {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
  if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
  return "en";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: initialLang(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export function setLanguage(code: LangCode) {
  window.localStorage.setItem(STORAGE_KEY, code);
  void i18n.changeLanguage(code);
  const dir = LANGUAGES.find((l) => l.code === code)?.dir ?? "ltr";
  document.documentElement.lang = code;
  document.documentElement.dir = dir;
}

export function getLanguage(): LangCode {
  return (i18n.language as LangCode) || "en";
}

export function applyDocumentLangDir() {
  if (typeof document === "undefined") return;
  const code = getLanguage();
  const dir = LANGUAGES.find((l) => l.code === code)?.dir ?? "ltr";
  document.documentElement.lang = code;
  document.documentElement.dir = dir;
}

export default i18n;
