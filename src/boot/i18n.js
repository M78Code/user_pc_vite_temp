import { createI18n } from "vue-i18n";
// 所有语中使用到的公共的国际化字符串
// import * as other from 'src/i18n/common-lang'
const i18n = createI18n({
  locale:
    (localStorage.h5_user_base_info &&
      localStorage.h5_user_base_info.languageName) ||
    "zh",
  fallbackLocale: "zh",
  // 增加所有语中使用到的公共的国际化字符串
  messages: {},
  legacy:true,
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
    /* webpackChunkName: "lang-[request]" */ `project_path/src/i18n/${map_lang[lang]}`
  ).then((langfile) => {
    // 动态加载对应的语言包
    let langFile = langfile.default;
    // 设置语言信息
    i18n.global.setLocaleMessage(lang, langFile);
    // 设置语种
    i18n.locale = lang;
    return lang;
  });
}
export { i18n, loadLanguageAsync, map_lang };
