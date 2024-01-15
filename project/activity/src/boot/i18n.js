/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 国际化默认配置文件
 */
 
import common_lang from 'project/activity/src/i18n/common-lang/index.json'
 
import {i18n} from  "./i18n-2.js"

/**
 * @description: 异步获取国际化数据,并设置
 * @param {*} lang
 * @return {*}
 */
function loadLanguageAsync (lang){
	// 语言映射路径
  let map_ = {
    'en': 'en-gb',// 英语
    'zh': 'zh-cn',// 中文
    'hk': 'zh-cn',// 中文繁译
    'tw': 'zh-tw',// 繁体
    'vi': 'vi-vn',// 越南语
    'th': 'th-th',// 泰语
    'ms': 'ms-my', // 马来语
    'ad': 'id-id', // 印尼语
    'mya':'my-my',//缅甸
    'pt':'pt-br',//葡萄牙
    'ry':'ja-jp',//日语
    'ko':'ko-kr',//韩语
    'es':'es-es',//西班牙
  }
  return import(/* webpackChunkName: "lang-[request]" */`project_path/src/i18n/${map_[lang]}/index.json`).then(langfile=>{
    // 设置语言信息
    i18n.global.setLocaleMessage(lang, { ...langfile, common_lang });
    // 设置语种
    i18n.global.locale = lang;
    return lang;
  })
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
export { i18n, loadLanguageAsync, i18n_t, i18n_tc }

