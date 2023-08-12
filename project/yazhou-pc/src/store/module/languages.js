import BaseUserInfo from "src/core/utils/user/base-user-info.js"

const initialState = {
  lang:localStorage.getItem('lang') || 'zh',//语言
  lang_obj:{
    'zh':[{'zh':'中文'},{'en':'EN'},],
    'en':[{'zh':'Chinese'},{'en':'EN'},]
  },//语言种类
  lang_change: false // 标识语言是否被改变
}

export default function languagesReducer(state = initialState, action) {
  switch (action.type) {
     // 设置语言
    case "SET_LANG":
      sessionStorage.setItem('lang',action.data);
      // 设置永久持久化语言信息
      localStorage.setItem('lang',action.data);
      BaseUserInfo.assign({languageName: action.data});
      return {...state, lang: action.data };
    // 初始化语言
    case "INIT_LANG":
      let key = sessionStorage.getItem('lang');
      if(key) {
        return { ...state, lang: key };
      } else {
        sessionStorage.setItem('lang', action.data);
        return { ...state, lang: action.data };
      }
    // 设置语言变化
    case "SET_LANG_CHANGE":
      return { ...state, lang_change: action.data };
    default:
      return state;
  }
}