/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 用户语言设置
 */
import { reactive } from 'vue';
import BaseUserInfo from "project/activity/src/public/utils/user/base_user_info.js"

const state = reactive({
  lang:localStorage.getItem('lang') || 'zh',//语言
  lang_obj:{
    'zh':[{'zh':'中文'},{'en':'EN'},],
    'en':[{'zh':'Chinese'},{'en':'EN'},]
  },//语言种类
  lang_change: false // 标识语言是否被改变
})

export default {
  getters: {
    //(获取语言)
    get_lang() {
      return state.lang;
    },
    //获取语言列表--未使用
    get_lang_list() {
      return state.lang_obj[state.lang];
    },
    //(获取语言是否变化)
    get_lang_change() {
      return state.lang_change;
    }
  },
  actions: {
    //设置语言
    set_lang({commit}, key){
      commit("set_lang", key);
    },
    //初始化语言
    init_lang({ commit }, default_lang) {
      commit("init_lang", default_lang);
    },
    //设置语言变化
    set_lang_change({ commit }, lang_change) {
      commit("set_lang_change", lang_change);
    }
  },
  mutations: {
     //设置语言
    set_lang(state, key){
      sessionStorage.setItem('lang',key);
      // 设置永久持久化语言信息
      localStorage.setItem('lang',key);
      state.lang = key;
      BaseUserInfo.assign({languageName: key});
    },
     //初始化语言
    init_lang(state, default_lang){
      let key = sessionStorage.getItem('lang');
      if(key)
      {
        state.lang = key;
      } else
      {
        sessionStorage.setItem('lang',default_lang);
        state.lang = default_lang;
      }
    },
     //设置语言变化
    set_lang_change(state, lang_change) {
      state.lang_change = lang_change;
    }
  }
};