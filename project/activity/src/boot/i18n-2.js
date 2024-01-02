/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 国际化默认配置文件
 */
import { createI18n } from 'vue-i18n'
 
// 所有语中使用到的公共的国际化字符串
// import other from 'src/i18n/other

const i18n = createI18n({
  locale: localStorage.pc_user_base_info && localStorage.pc_user_base_info.languageName || 'zh',
  fallbackLocale: 'zh',
  // 增加所有语中使用到的公共的国际化字符串
  messages:{},
  legacy: true,
  // 去除控制台i18n警告信息
  silentTranslationWarn: true,
})

 
export { i18n }

