
//  import { LocalStorage, SessionStorage  } from "src/core/utils/index.js";
 import { LocalStorage, SessionStorage  } from "src/core/utils/module/web-storage.js";

 import { createI18n } from "vue-i18n";

 import BUILDIN_CONFIG from "app/job/output/env/final.js";


 const PROJECT_NAME= BUILDIN_CONFIG.TARGET_PROJECT_NAME

 const IS_PC = PROJECT_NAME.includes('h5')
// 所有语中使用到的公共的国际化字符串
// import * as other from 'src/i18n/common-lang'
const i18n = createI18n({
  locale: LocalStorage.get("lang", "zh"),
  fallbackLocale: "zh",
  // 增加所有语中使用到的公共的国际化字符串
  messages: {},
  legacy: true,
  // 去除控制台i18n警告信息
  silentTranslationWarn: true,
});

const map_lang = {
  en: "en-gb",
  zh: "zh-cn",
  tw: "zh-tw",
  vi: "vi-vn",
  th: "th-th",
  ms: "ms-my",
  ad: "id-id",
  mya: "my-my",
  pt: "pt-br",
  ry: "ja-jp",
  ko: "ko-kr",
  es: "es-es",
};
/**
 * @description: 异步获取国际化数据,并设置
 * @param {*} lang
 * @return {*}
 */
function loadLanguageAsync(lang) {
  // 语言映射路径

  return import(
    /* webpackChunkName: "lang-[request]" */ `../i18n/${IS_PC?'pc':'h5'}/${map_lang[lang]}/index.json`
  ).then((langfile) => {
    // 动态加载对应的语言包
    let langFile = langfile.default;
    // 设置语言信息
    i18n.global.setLocaleMessage(lang, langFile);
    // 设置语种
    i18n.locale = lang;
    return lang;
  }).catch(error => {
    console.log('lockie_test_consolee', error);
  });
}
// 新增
function t(key, args, options) {
  if (!i18n) return key;
  return i18n.global.t(key, args, options);
}
// 新增
function i18n_t(key, args, options) {
  if (!i18n) return key;
  return i18n.global.t(key, args, options);
}
export { i18n, loadLanguageAsync, map_lang, t,i18n_t };
