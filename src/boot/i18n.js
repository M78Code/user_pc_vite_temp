 
import lodash from 'lodash'
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const {   IS_PC } = BUILDIN_CONFIG 
 

import { i18n ,server_key_map ,map_lang } from  "./i18n-2.js"

 

 

/**
 * @description: 异步获取国际化数据,并设置
 * @param {*} lang 如果沒有穿入就是用緩存的
 * @return {*}
 */
const loadLanguageAsync = async (lang_) => {
  let lang = lang_ == 'hk' ? 'zh' : lang_ || locale
  try {
    const langfile = await import( /* webpackChunkName: "lang-[request]" */ `../i18n/${IS_PC ? 'pc' : 'h5'}/${map_lang[lang]}/index.json`)
    console.log(langfile,'langfile');
    const commLang = await import( /* webpackChunkName: "lang-[request]" */ `../i18n/${IS_PC ? 'pc' : 'h5'}/common-lang/index.json`)
    // 动态加载对应的语言包
    // let langFile = langfile.default || langfile;
    // 设置语言信息
    //加载服务器语言设置
    let msg = {}
    const server_val = server_key_map[lang];
    if (server_val) {
      const message = server_i18n_map[server_val]
      for (let v in message) {
        lodash.set(msg, v, message[v])
      }
    }
    // console.error('ssss',lang)
    i18n.global.setLocaleMessage(lang, { ...langfile, ...msg,...commLang });
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
  return i18n?.global?.tm(key, args, options);
}
// 新增
function i18n_tc(key, args, options) {
  if (!i18n) return key;
  return i18n?.global?.tc(key, args, options);
}
export { i18n, loadLanguageAsync, map_lang,   i18n_t, i18n_tc, server_key_map };
