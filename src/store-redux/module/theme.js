/** 项目主题设置相关 */
// import $class from "licia/$class"
// import lodash from 'lodash'
// // TODO: pc引入
// import setTheme from "src/public/utils/theme/theme.js"
// // TODO: h5引入
// import { change_theme_variable } from "src/css/pro/bw3/variable/variable.mjs"
// import { ls, ss } from 'src/core/utils/web-storage.js'

const initialState = {
    /** 主题 */
    theme: '',
}


export default function languagesReducer(state = initialState, action) {
    const { type, data } = action
    switch (type) {
        case 'SET_THEME':
            // // TODO:  userinfo redux
            // const user_id = ''
            // const local_theme_obj = ls.get('userId_theme', {})
            // const theme_obj = Object.assign({}, local_theme_obj, { [user_id]: theme })
            // ls.set('userId_theme', theme_obj)

            // // 主题列表
            // const theme_list = [
            //     'theme01',
            //     'theme02',
            //     'theme01_y0',
            //     'theme02_y0',
            // ]
            // // 批量移除前一个主题相关内容
            // theme_list.forEach(theme => {
            //     // 移除主题class类
            //     $class.remove('body', theme)
            // })
            // // 添加主题class
            // $class.add('body', theme)
            // state.theme = theme;
            // // 添加主题变量
            // change_theme_variable(theme, function (obj) {
            //     // TODO: userinfo redux
            //     if (lodash.get(window.vue, '$store.getters.get_user.favoriteButton')) {
            //         obj.theme_common['com-img-bg-10'] = obj.theme_common['com-img-bg-9'];
            //         obj.current_theme['img-bg-78'] = obj.theme_common['com-img-bg-9'];
            //     }
            // })
            return { ...state, lang: data }
        default:
            return state
    }
}