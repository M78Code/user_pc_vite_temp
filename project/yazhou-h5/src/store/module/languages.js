/*
 * @Author: success
 * @Date: 2020-08-20 18:35:53
 * @Description: 用户语言设置
 *  zs-简体中文
 *  zh-繁体中文（目前与zs没做区分）
 *  en-英文
 *  jp-日文
 *  ko-韩文
 *  vi-越南语
 *  th-泰国语
 */
// export default {
//   state: {
//     lang: 'zh',   //当前语言
//     is_language_changing:false,
//   },
//   getters: {
//     get_lang(state) {
//       return state.lang;
//     },
//     get_is_language_changing(state){
//       return state.is_language_changing;
//     }
//   },
//   mutations: {
//     set_lang(state, key) {
//       state.lang = key;
//     },
//     set_is_language_changing(state,v){
//       state.is_language_changing = v;
//     }
//   }
// };

const initialState = {
  //当前语言
  lang: 'zh',
  // 是否更换语言
  is_language_changing:false,
};
export default function languageReducer(state = initialState, action) {
  switch (action.type) {
    // 设置主题
    case "SET_LANG":
      return { ...state, lang: action.data };
    case "SET_LANGUAGE_CHANGING":
      return { ...state, is_language_changing: action.data };
    default:
      return state;
  }
}