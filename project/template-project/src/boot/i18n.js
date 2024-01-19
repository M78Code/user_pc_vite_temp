import { createI18n } from 'vue-i18n'
import { LocalStorage } from 'src/core/utils/common/module/web-storage.js'
// 所有语中使用到的公共的国际化字符串
// import other from 'src/i18n/other
const locale = LocalStorage.get('lang', "zh"); //緩存的值
const i18n = createI18n({
 
  locale: locale,
  fallbackLocale: "zh",
  // 增加所有语中使用到的公共的国际化字符串
  messages:{},
  silentTranslationWarn: true
})


	// 语言映射路径
  let map_lang = {
    'en': 'en-gb',// 英语
    'zh': 'zh-cn',// 中文
    'tw': 'zh-tw',// 繁体
    // 'vi': 'vi-vn',// 越南语
    // 'th': 'th-th',// 泰语
    // 'ms': 'ms-my', // 马来语
    // 'ad': 'id-id', // 印尼语
    // 'mya':'my-my',//缅甸
    // 'pt':'pt-br',//葡萄牙
    // 'ry':'ja-jp',//日语
    // 'ko':'ko-kr',//韩语
    // 'es':'es-es',//西班牙
  }

/**
 * @description: 异步获取国际化数据,并设置
 * @param {*} lang
 * @return {*}
 */
const  loadLanguageAsync= async(lang)=>{
  console.log(lang)
  try {
    const langfile =  await  import(/* webpackChunkName: "lang-[request]" */`../i18n/${map_lang[lang]}/index.json`) 
    // 设置语言信息
    i18n.global.setLocaleMessage(lang, { ...langfile,   });
    i18n.global.locale = lang;
    // 设置语种
    i18n.locale = lang;
    return lang;
  } catch (error) {
    return lang;
  }

  
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




export { i18n, loadLanguageAsync, map_lang,  i18n_t, i18n_tc   };

