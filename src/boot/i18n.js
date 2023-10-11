
//  import { LocalStorage, SessionStorage  } from "src/core/utils/index.js";
import { LocalStorage, SessionStorage } from "src/core/utils/module/web-storage.js";
import server_i18n_map from "app/job/output/i18n/index.json";


import { createI18n } from "vue-i18n";
import lodash from 'lodash'
import BUILDIN_CONFIG from "app/job/output/env/final.js";


const PROJECT_NAME = BUILDIN_CONFIG.TARGET_PROJECT_NAME

const IS_PC = PROJECT_NAME.includes('pc')
const locale = LocalStorage.get("lang", "zh"); //緩存的值
// 所有语中使用到的公共的国际化字符串
// import * as other from 'src/i18n/common-lang'
const i18n = createI18n({
  locale: locale,
  fallbackLocale: "zh",
  // 增加所有语中使用到的公共的国际化字符串
  messages: {},
  legacy: true,
  // 去除控制台i18n警告信息
  silentTranslationWarn: true,
});
//服务器语言打包key对应本地语言key
const server_key_map = {
  "en-gb": "en",
  "zh-cn": "zh",
  "zh-tw": "tw",
  "vi-vn": "vi",
  "th-th": "th",
  "ms-my": "ms",
  "id-id": "ad",
  "my-my": "mya",
  "pt-br": "pt",
  "ja-jp": "ry",
  "ko-kr": "ko",
  "es-es": "es",
}

//语言key对应的本地 文件夹
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
 * @param {*} lang 如果沒有穿入就是用緩存的
 * @return {*}
 */
function loadLanguageAsync(lang) {
  lang = lang || locale
  // 语言映射路径
  return import(
    /* webpackChunkName: "lang-[request]" */ `../i18n/${IS_PC ? 'pc' : 'h5'}/${map_lang[lang]}/index.json`
  ).then((langfile) => {
    LocalStorage.set("lang", lang),
      // 动态加载对应的语言包
      // let langFile = langfile.default || langfile;
      // 设置语言信息
      console.error(langfile)
    //加载服务器语言设置
    let msg = {}
    const server_val = server_key_map[lang];
    if (server_val) {
      const message = server_i18n_map[server_val]
      for (let v in message) {
        lodash.set(msg, v, message[v])
      }
    }
    i18n.global.setLocaleMessage(lang, { ...langfile, ...msg });
    i18n.global.locale = lang;
    // 设置语种
    i18n.locale = lang;
    return lang;
  }).catch(error => {
    console.error('lockie_test_consolee', error);
  });

}
// 新增
function t(key, args, options) {
  if (!i18n) return key;
  return i18n.global.tm(key, args, options);
}
// 新增
function i18n_t(key, args, options) {
  if (!i18n) return key;
  return i18n.global.tm(key, args, options);
}
// 新增
function i18n_tc(key, args, options) {
  if (!i18n) return key;
  return i18n.global.tc(key, args, options);
}
export { i18n, loadLanguageAsync, map_lang, t, i18n_t, i18n_tc, server_key_map };
