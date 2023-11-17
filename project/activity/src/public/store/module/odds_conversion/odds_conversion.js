/*
 * @Author: Amor
 * @Date: 2020-08-04 17:13:55
 * @Description: 赔率转换相关
 */
import { reactive } from 'vue';

const state = reactive({
    // 从服务器拉取到的 赔率转换表
    odds_coversion_map: ""
})

export default {

    getters: {
        //赔率映射表
        get_odds_coversion_map() {
            return state.odds_coversion_map;
        },
    },
    actions: {
        //保存赔率映射表
        set_odds_coversion_map({ commit }, odds_coversion_map) {
            commit("set_odds_coversion_map", odds_coversion_map);
        },
    },

    mutations: {
        //保存赔率映射表
        set_odds_coversion_map(state, odds_coversion_map) {
            state.odds_coversion_map = odds_coversion_map
        },

    }
}