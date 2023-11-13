/*
 * @Author: Yellow
 * @Date: 2020-08-04 17:13:55
 * @Description: 投注记录
 */

export default {
    state: {
        show_record: false
    },
    getters: {
        get_show_record(state) {
            return state.show_record
        }
    },
    actions: {
        set_show_record({ commit }, isShow) {
            commit("set_show_record", isShow)
        }
    },
    mutations: {
        set_show_record(state, isShow) {
            state.show_record = isShow
        }
    }
}