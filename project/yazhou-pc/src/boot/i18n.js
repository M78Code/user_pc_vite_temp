/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 国际化默认配置文件
 */
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
  // 去除控制台i18n警告信息
  silentTranslationWarn: true,
});

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
/**
 * @description: 异步获取国际化数据,并设置
 * @param {*} lang
 * @return {*}
 */
function loadLanguageAsync(lang) {
  return import(
    /* webpackChunkName: "lang-[request]" */ `src/i18n/${map_[lang]}`
  ).then((langfile) => {
    // 动态加载对应的语言包
    let langFile = langfile.default;
    // 设置语言信息
    i18n.setLocaleMessage(lang, langFile);
    // 设置语种
    i18n.locale = lang;
    return lang;
  });
}
export { i18n, loadLanguageAsync };
