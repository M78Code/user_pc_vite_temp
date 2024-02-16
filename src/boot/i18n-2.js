
 
import { LocalStorage } from 'src/core/utils/common/module/web-storage.js'
 
import { createI18n } from "vue-i18n";
 
 
 


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
  "ru-ru": "ru",
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
  ru: "ru-ru"
};


let browser_lang = String(navigator.language).slice(0, 2) //获取浏览器语言
browser_lang = map_lang[browser_lang] ? browser_lang : 'en' //兜底 如果url带语言就是url语言  浏览器语言存在就是浏览器语言 不然就默认en英语

let qs_lang = window.SEARCH_PARAMS.init_param.get('lang') //如果url带语言就是url语言  不然就是 浏览器语言
qs_lang = map_lang[qs_lang] ? qs_lang : undefined //兜底 如果url带语言就是url语言  浏览器语言存在就是浏览器语言 不然就默认en英语

let locale_lang = LocalStorage.get('lang'); //緩存的值
locale_lang = map_lang[locale_lang] ? locale_lang : browser_lang //
if (qs_lang) { //url存在语言
  LocalStorage.set('lang', qs_lang) //缓存语言
} else if (!LocalStorage.get('lang')) { //没有设定过语言 | 缓存的语言不在支持的语言中
  LocalStorage.set('lang', locale_lang) //缓存语言
}
// 所有语中使用到的公共的国际化字符串
// import * as other from 'src/i18n/common-lang'
const i18n = createI18n({
  locale: qs_lang || locale_lang,
  fallbackLocale: 'en',
  // 增加所有语中使用到的公共的国际化字符串
  messages: {},
  legacy: true,
  // 去除控制台i18n警告信息
  silentTranslationWarn: true,
});



 
export { i18n ,server_key_map ,map_lang };
