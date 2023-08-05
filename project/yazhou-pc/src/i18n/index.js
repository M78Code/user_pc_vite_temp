import common_lang from "./common-lang/index.json";
// 所有语中使用到的公共的国际化字符串
// import other from 'src/i18n/other'
import { createI18n } from "vue-i18n";
import { nextTick } from "vue";
// 语言映射路径
let map_ = {
  en: "en-gb", // 英语
  zh: "zh-cn", // 中文
  tw: "zh-tw", // 繁体
  vi: "vi-vn", // 越南语
  th: "th-th", // 泰语
  ms: "ms-my", // 马来语
  ad: "id-id", // 印尼语
  mya: "my-my", //缅甸
  pt: "pt-br", //葡萄牙
  ry: "ja-jp", //日语
  ko: "ko-kr", //韩语
  es: "es-es", //西班牙
};
let i18n;

function setupI18n(app, options = { locale: "en" }) {
  i18n = createI18n({
    // legacy: false,
    // globalInjection: true,
    // 增加所有语中使用到的公共的国际化字符串
    locale:
      (localStorage.pc_user_base_info &&
        localStorage.pc_user_base_info.languageName) ||
      "zh",
    silentTranslationWarn: true,
  });
  app.use(i18n);
  return i18n;
}

/**
 * @description: 异步获取国际化数据,并设置
 * @param {*} lang
 * @return {*}
 */
async function loadLanguageAsync(lang) {
  const langfile = await import(
    /* webpackChunkName: "lang-[request]" */ `src/i18n/${map_[lang]}/index.json`
  );
  // 设置语种
  i18n.setLocaleMessage(lang, { ...langfile, common_lang });
  return nextTick();
}
export { i18n, loadLanguageAsync, setupI18n };
