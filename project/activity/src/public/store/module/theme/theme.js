/*
 * @Author: Cable
 * @Date: 2020-09-10 12:18:36
 * @Description: 项目主题设置相关
 */
import $class from  "licia-es/$class"
import setTheme from "src/public/utils/theme/theme.js"

export default {
  state: {
    // 主题
    theme: '',

  },
  getters: {
    /**
     * @description: 获取主题
     * @param {Object} state 操作句柄
     * @return {undefined} undefined
     */
    get_theme(state) {
      return state.theme;
    },

  },
  actions: {

    /**
     * @description: 设置主题
     * @param {Object} state 操作句柄
     * @param {String} type 主题类型
     * @return {undefined} undefined
     */
    set_theme({commit, rootGetters}, type){
      const theme_obj = {
        user_id: rootGetters.get_user.userId,
        theme: type
      }
      sessionStorage.setItem("theme", type);
      commit("set_theme", theme_obj);
    },
  },
  mutations: {

    /**
     * @description: 设置主题
     * @param {Object} state 操作句柄
     * @param {String} type 主题类型
     * @return {undefined} undefined
     */
    set_theme(state, obj){
      const { user_id, theme } = obj


      const local_theme_obj = localStorage.getItem('userId_theme') && JSON.parse(localStorage.getItem('userId_theme')) || {}
      const theme_obj = Object.assign({}, local_theme_obj, {[user_id]: theme})
      localStorage.setItem('userId_theme', JSON.stringify(theme_obj));

      // 主题列表
      const theme_list = [
        'theme01',
        'theme02',
        'theme01_y0',
        'theme02_y0',
      ]

      // 批量移除前一个主题相关内容
      theme_list.forEach(theme => {
        // 移除主题class类
        $class.remove('body', theme)
      })

      // 添加主题class
      $class.add('body', theme)
      state.theme = theme;
      // 添加主题变量
      setTheme.change_theme_variable(theme, function(alltheme){
        if(_.get(window.vue,'$store.getters.get_user.favoriteButton')){
          alltheme['y0-collect-start-text-color-3']=alltheme['y0-collect-start-text-color-upd-4']
        }
      })

    }
  }
};
